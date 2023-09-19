const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

let Nombre

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('¡Hola! Estas escribiendo a nuestro *CHATBOT MAAJI ATRACCIÓN DE TALENTOS*, Recuerda leer la *POLITICA DE PRIVACIDAD Y TRATAMIENTO DE DATOS PERSONALES* en el siguiente link: https://acortar.link/46JQbL  \n MARCA: \n👉1️⃣)Si estoy de acuerdo con la politica \n \n👉 2️⃣)No estoy de acuerdo con la politica', { capture: true },
        async (ctx, { flowDynamic,fallBack,gotoFlow }) => {
            // const body = ctx.body
            let opcion = ctx.body.trim();
            if (!['1', '2'].includes(opcion)) 
            {
                return fallBack(`Opción no valida\n Ingresa opción *1* ó *2*`)
            }
            switch (opcion) {
                case '1':
                    console.log("acepta politicas")
                    return flowDynamic()
                case '2':
                    console.log("no acepta politicas")
                    await gotoFlow(flowNoaceptapolitica)
                    break;
            }
        }
    )

    .addAnswer('Muy bien! Cuéntanos, ¿Cuál es tu nombre?', { capture: true },
        async (ctx, { fallBack, flowDynamic,gotoFlow }) => {
            if (ctx.body.match(/\d+/)) {
                return fallBack(`Parece que no es un nombre correcto \n Vuelve a ingresarlo por favor`)
            }
            else {
                Nombre = ctx.body;
                await flowDynamic(`Perfecto *${Nombre}*, ¿Como podemos orientarte?`)
                return;
            }
            
        }

    )

    .addAnswer('👉 1️⃣) Busco oportunidad laboral o practica laboral en el portal de Maaji   \n \n 👉 2️⃣)Si no encuentras en nuestro portal Maaji una oferta que se ajuste a tu perfil,selecciona esta opción para que diligencié el formato de Curriculum Vitae.  ', { capture: true },
    async (ctx, { fallBack, flowDynamic,gotoFlow }) => {
        let opcion = ctx.body.trim()
        if (!['1', '2'].includes(opcion)) 
        {
            return fallBack(`Opción no valida\n Ingresa opción *1* o *2*`)
        }
    switch (opcion) {
        case '1':
            await flowDynamic(`Es un gusto para Maaji que nos tengas en cuenta como compañía, ingresa a nuestro portal de Empleo y aplica a la oferta laboral que mas se ajuste a tu perfil. https://maaji.buk.co/trabaja-con-nosotros   \n Si al ingresar al portal te ajustas a una de nuestras ofertas. Estaremos revisando tu curriculum y validaremos si el perfil que relacionas cumple con las expectativas del rol Maaji. `)
            await gotoFlow(flowDespedida)  
            break
        case '2':
            await flowDynamic('Ingresa al siguiente link: https://forms.office.com/r/zr2byEZnsc y diligencia el formulario! \nEstaremos revisando la información ')
            await gotoFlow(flowDespedida)
            break
            
    }
   
}) 

const flowDespedida = addKeyword('##DESPEDIDA##').addAnswer( '📑🧐', {delay:0 ,capture:true},
    async (ctx,{endFlow,gotoFlow,flowDynamic}) =>{
        let opcion = ctx.body.trim();
            if (['gracias','hasta luego','muchas gracias','thanks','listo','graciass','chao','ok','muchisimas gracias','r'].includes(opcion)) 
            {
                await endFlow(`*${Nombre}*, Muchas Gracias por querer ser parte de esta comunidad *Maajica*`)
                return
            }
            else{
                await flowDynamic(`¿Algo mas *${Nombre}* ? Te enviare al inicio`)
                await gotoFlow(flowPrincipal)
            }
    }
    )

const flowNoaceptapolitica = addKeyword('##NOACEPTAPOLITICA##').addAnswer('Gracias por tu interés pero al no aceptar las politicas no podrás seguir con el proceso😕', {delay:0 ,capture:true},
async (ctx,{endFlow}) =>{
    let opcion = ctx.body.trim();
        if (['gracias','hasta luego','muchas gracias','thanks','listo','graciass','chao','ok','muchisimas gracias','r'].includes(opcion)) 
        {
            await endFlow(`Con gusto!, Si cambias de opinion no dudes en volvernos a escribir`)
            return;
        }
        else{
            await endFlow(`Si cambias de opinion no dudes en volvernos a escribir`)
            return;
        }
})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,flowDespedida])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
