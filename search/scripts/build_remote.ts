import { resolve } from 'node:path'
import { cwd } from 'process'
import { readFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'

import { get_phrases } from './parsing.mjs'

const run = async () => {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('the `TURSO_DATABASE_URL` environment variable is not set!')
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error('the `TURSO_AUTH_TOKEN` environment variable is not set!')
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
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
    let sense_group_id_number = 0
    const sense_group_id_number_map = new Map(
      phrases.map((phrase) => [phrase.sense_group_id, ++sense_group_id_number]),
    )
    const inserts = phrases.map((phrase) => {
      const escaped_english = phrase.english.replace(/'/gi, "''")
      const sense_group_id_number = sense_group_id_number_map.get(phrase.sense_group_id)
      const sql = `INSERT INTO phrases VALUES (
          '${phrase.id}',
          '${sense_group_id_number}',
          '${phrase.traditional}',
          '${phrase.simplified}',
          '${escaped_english}',
          '${phrase.pinyin}',
          '${phrase.jyutping}'
        );
      `

      return sql
    })

    await client.batch([
      // set up database
      'DROP TABLE IF EXISTS phrases;',
      `
      CREATE TABLE phrases (
        'id' VARCHAR(32) PRIMARY KEY NOT NULL,
        'sense_group_id' INT NOT NULL,
        'traditional' VARCHAR(32),
        'simplified' VARCHAR(32),
        'english' VARCHAR(128),
        'pinyin' VARCHAR(128),
        'jyutping' VARCHAR(128)
      );`,
      'CREATE INDEX IF NOT EXISTS sense_group_id_index ON phrases(sense_group_id);',
      // https://sqlite.org/fts5.html > 4.4.3
      'DROP TABLE IF EXISTS search;',
      `
      CREATE VIRTUAL TABLE search USING fts5(
        id UNINDEXED,
        sense_group_id UNINDEXED,
        traditional,
        simplified,
        english,
        pinyin,
        jyutping,
        content=phrases
      );`,
      `
      CREATE TRIGGER insert_search_after_insert_phrases AFTER INSERT ON phrases BEGIN
        INSERT INTO search(
          rowid,
          traditional,
          simplified,
          english,
          pinyin,
          jyutping
        )
        VALUES (
          new.rowid,
          new.traditional,
          new.simplified,
          new.english,
          new.pinyin,
          new.jyutping
        );
      END;`,
      ...inserts,
    ])

    client.close()
  } catch (throwable) {
    const error = throwable instanceof Error ? throwable : new Error(String(throwable))

    console.error('build failed:', error)

    throw error
  }
}

run()
