# O que é ?

- Um bot do whatsapp no qual instala áudios do youtube recebendo apenas o link.
- Além de instalar o bot guarda os seguintes dados no arquivo `src/allFilenames.data.json`:
  - updatedAt: Última vez que alguém baixou uma música utilizando o bot
  - filenames: Um array que contem os nomes dos arquivos


# Como rodar em desenvolvimento:

## Antes de rodar você precisa criar uma pasta vazia "medias" dentro de /dist.

- 1 - `nvm use`
- 2 - `npm i`
- 3 - `npm run start-dev`
- 4 - Scaneie o qrCode que irá aparecer no seu terminal **com um whatsapp**

# Como rodar em "produção":

## Antes de rodar você precisa criar uma pasta vazia "medias" dentro de /src.

- 1 - `nvm use`
- 2 - `npm i`
- 3 - `npm run build`
- 4 - `npm run start-prod`
- 5 - Scaneie o qrCode que irá aparecer no seu terminal **com um whatsapp**

# Como utilizar:

1 - Envie o link de uma música do youtube no whatsapp para o número que scaneou o código

2 - Ou envie o comando: !formatos para o bot listar os formatos de link do youtube que o bot aceita.