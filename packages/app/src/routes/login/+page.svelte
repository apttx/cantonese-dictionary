<script lang="ts">
  export let data

  let registration_state: 'idle' | 'registering' | 'error' = 'idle'
  const register = async () => {
    registration_state = 'registering'

    const challenge = Uint8Array.from(data.challenge, (character) => character.charCodeAt(0))
    const id = Uint8Array.from(data.user_id, (character) => character.charCodeAt(0))

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Cantonese Dictionary',
          id: 'localhost:5173',
        },
        user: {
          id,
          displayName: 'Chef',
          name: 'chef@cantonese-dictionary.com',
        },
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key',
          },
        ],
        attestation: 'none',
      },
    })
  }

  let authentication_state: 'idle' | 'authenticating' | 'error' = 'idle'
  const authenticate = async () => {
    authentication_state = 'authenticating'

    const credential = await navigator.credentials.get({
      publicKey: {},
    })
  }
</script>

<div
  class="@content"
  style="margin-top: 4rem;"
>
  <button
    on:click={register}
    class="@button">register {registration_state}</button
  >

  <button
    on:click={authenticate}
    class="@button">authenticate {authentication_state}</button
  >
</div>
