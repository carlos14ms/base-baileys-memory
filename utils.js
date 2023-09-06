const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('node:fs/promises');

const handlerDocument = async (ctx) => {
    const buffer = await downloadMediaMessage(ctx, "buffer");
    const pathDocument= `${process.cwd()}/tmp/${Date.now()}.pdf`;
    await fs.writeFile(pathDocument, buffer);
    return pathDocument
}

module.exports = { handlerDocument }