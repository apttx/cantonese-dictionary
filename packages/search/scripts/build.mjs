import { resolve } from 'node:path'
import { cwd } from 'process'
import { mkdir, readFile, rm } from 'node:fs/promises'

import { get_phrases } from './parsing.mjs'
import { get_promisified_database } from './sqlite.mjs'

const build_directory = 'build/'

const run = async () => {
  const database_file_path = resolve(cwd(), build_directory, 'sqlite.db')

  try {
    // set up build files
    await mkdir(build_directory, { recursive: true })
    await rm(database_file_path, { force: true })
    // set up database
    const database = await get_promisified_database(database_file_path)
    await database.exec(`
      DROP TABLE IF EXISTS phrases;
      CREATE TABLE phrases (
        'id' VARCHAR(32) PRIMARY KEY NOT NULL,
        'sense_group_id' VARCHAR(32) NOT NULL,
        'traditional' VARCHAR(32),
        'simplified' VARCHAR(32),
        'english' VARCHAR(128),
        'pinyin' VARCHAR(128),
        'jyutping' VARCHAR(128)
      );
      CREATE INDEX IF NOT EXISTS sense_group_id_index ON phrases(sense_group_id);
    `)
    await database.exec(`
      DROP TABLE IF EXISTS search;
      CREATE VIRTUAL TABLE search USING fts5(
        id,
        sense_group_id,
        traditional,
        simplified,
        english,
        pinyin,
        jyutping
      );
    `)

    // parse data
    console.info('[info] parsing phrases [@run]')
    const data_source_files_directory = resolve(cwd(), './data_source_files')
    const cc_cedict_file_path = resolve(data_source_files_directory, './cedict.txt')
    const cc_canto_file_path = resolve(data_source_files_directory, './canto.txt')
    const cc_cedict_canto_readings_file_path = resolve(
      data_source_files_directory,
      './cedict_canto_readings.txt',
    )
    const [cc_cedict_file, cc_canto_file, cc_cedict_canto_readings_file] = await Promise.all([
      readFile(cc_cedict_file_path),
      readFile(cc_canto_file_path),
      readFile(cc_cedict_canto_readings_file_path),
    ])
    const phrases = await get_phrases({
      cc_cedict_file,
      cc_canto_file,
      cc_cedict_canto_readings_file,
    })

    // write data
    console.info('[info] writing to database [@run]')
    const inserts = phrases.map(
      (phrase) =>
        `INSERT INTO phrases VALUES (
          '${phrase.id}',
          '${phrase.sense_group_id}',
          '${phrase.traditional}',
          '${phrase.simplified}',
          '${phrase.english.replace(/'/gi, "''")}',
          '${phrase.pinyin}',
          '${phrase.jyutping}'
        );
        INSERT INTO search VALUES (
          '${phrase.id}',
          '${phrase.sense_group_id}',
          '${phrase.traditional}',
          '${phrase.simplified}',
          '${phrase.english.replace(/'/gi, "''")}',
          '${phrase.pinyin}',
          '${phrase.jyutping}'
        );
      `,
    )
    const sql = `
          BEGIN TRANSACTION;
          ${inserts.join('\n')};
          COMMIT;
      `
    await database.exec(sql)

    await database.close()
  } catch (caught) {
    const error = /** @type {Error} */ (caught)

    console.error('build failed:', error)

    if ('code' in error && error.code === 'SQLITE_CANTOPEN') {
      console.error(`  database file path: ${database_file_path}`)
    }

    throw error
  }
}

run()
