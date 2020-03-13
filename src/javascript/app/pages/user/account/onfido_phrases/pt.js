module.exports = {
    document_selector: {
        identity: {
            title                      : 'Verifique sua identidade',
            hint                       : 'Selecione o tipo de documento que você deseja enviar',
            passport_hint              : 'Foto da página que mostra o rosto',
            driving_licence_hint       : 'Frente e verso',
            national_identity_card_hint: 'Frente e verso',
        },
    },
    capture: {
        driving_licence: {
            front: {
                title       : 'Enviar carteira de condução (frente)',
                instructions: 'Enviar a frente da carteira de condução direto do seu computador',
                webcam      : 'Posicione a frente da cateira de condução no quadro (ela será detectada automaticamente)',
            },
            back: {
                title       : 'Enviar carteira de condução (verso)',
                instructions: 'Enviar o verso da carteira de condução direto do seu computador',
                webcam      : 'Posicione o verso da cateira de condução no quadro (ela será detectada automaticamente)',
            },
        },
        national_identity_card: {
            front: {
                title       : 'Enviar carteira de identidade nacional (frente)',
                instructions: 'Enviar a frente da carteira nacional direto do seu computador',
                webcam      : 'Posicione a frente da carteira nacional no quadro (ela será detectada automaticamente)',
            },
            back: {
                title       : 'Enviar carteira de identidade nacional (verso)',
                instructions: 'Enviar o verso da carteira nacional direto do seu computador',
                webcam      : 'Posicione o verso da carteira nacional no quadro (ela será detectada automaticamente)',
            },
        },
        passport: {
            front: {
                title       : 'Enviar foto da página do passaporte',
                instructions: 'Enviar a página do passaporte (a que mostra sua foto) direto do seu computador',
                webcam      : 'Posicione a página do passaporte (a que mostra sua foto) no quadro (ela será detectada automaticamente)',
            },
        },
        face: {
            title       : 'Tire uma selfie',
            upload_title: 'Selfie',
            instructions: 'Enviar uma selfie direto do seu computador',
            intro       : {
                title              : 'Tire uma selfie',
                subtitle           : 'Carregar uma selfie do seu computador',
                selfie_instruction : 'Olhe para frente e verifique se seus olhos estão claramente visíveis',
                glasses_instruction: 'Retire os óculos, se necessário',
                accessibility      : {
                    selfie_capture_tips: 'Dicas para tirar uma boa selfie',
                },
            },
        },
        upload_document: 'Enviar',
        upload_file    : 'ou fazer upload de foto - (não envie digitalizações)',
        take_photo     : 'Tirar uma foto',
        switch_device  : 'Continue no telefone',
    },
    confirm: {
        document: {
            title: 'Verificar legibilidade',
            alt  : 'Foto do seu documento',
        },
        driving_licence: {
            message: 'Certifique-se de que todos os detalhes da sua carteira de condução estejam visíveis, sem borrões ou reflexos',
        },
        national_identity_card: {
            message: 'Certifique-se de que todos os detalhes da sua ID nacional estejam visíveis, sem borrões ou reflexos',
        },
        passport: {
            message: 'Certifique-se de que todos os detalhes da seu passaporte estejam visíveis, sem borrões ou reflexos',
        },
        face: {
            standard: {
                title  : 'Verifique sua selfie',
                message: 'Verifique se a sua selfie mostra claramente o seu rosto',
                alt    : 'Foto do seu rosto',
            },
        },
        confirm      : 'Confirmar',
        continue     : 'Continuar',
        redo         : 'Voltar',
        enlarge_image: {
            close: 'Fechar',
        },
    },
    cross_device: {
        intro: {
            title           : 'Continue no telefone',
            sub_title       : 'Veja como fazer:',
            description_li_1: 'Envie um link seguro para o seu telefone',
            description_li_2: 'Abra o link e conclua as tarefas',
            description_li_3: 'Volte aqui para finalizar o envio',
            action          : 'Obter link seguro',
        },
        client_success: {
            title    : 'Envios bem-sucedidos',
            sub_title: 'Agora você pode retornar ao seu computador para continuar',
            body     : 'O seu computador pode demorar alguns segundos para atualizar',
        },
        link: {
            title                : 'Obtenha seu link seguro',
            qr_code_sub_title    : 'Digitalize o código QR com o seu telefone',
            sms_sub_title        : 'Envie este link único para o seu telefone',
            copy_link_sub_title  : 'Abra o link no seu celular',
            options_divider_label: 'ou',
            sms_option           : 'Obter link via SMS',
            copy_link_option     : 'Copiar link',
            qr_code_option       : 'Digitalizar código QR',
            copy_link            : {
                action : 'Copiar',
                success: 'Copiado',
            },
            qr_code: {
                help_label : 'Como digitalizar um código QR',
                help_step_1: 'Aponte a câmera do seu telefone para o código QR',
                help_step_2: 'Se não funcionar, baixe um scanner de código QR no Google Play ou na App Store',
            },
            sms_label      : 'Digite seu número de celular:',
            copy_link_label: 'Copie o link para o seu navegador no celular',
        },
        phone_number_placeholder: 'insira o número do celular',
        loading                 : 'Carregando...',
        mobile_connected        : {
            title: {
                message   : 'Conectado ao seu celular',
                submessage: 'Quando terminar, levaremos você para a próxima etapa',
            },
            tips: {
                item_1: 'Mantenha essa janela aberta enquanto estiver usando seu celular',
                item_2: 'Seu link para celular expirará em uma hora',
                item_3: 'Não atualize esta página',
            },
        },
        mobile_notification_sent: {
            title       : 'Verifique seu celular',
            submessage  : 'Enviamos um link seguro para %{number}',
            bold_message: 'It may take a few minutes to arrive',
            tips        : {
                item_1: 'Pode demorar alguns minutos para chegar',
                item_2: 'Seu link expirará em uma hora',
            },
            resend_link: 'Reenviar link',
        },
        switch_device: {
            header: 'Tire uma foto com seu telefone',
        },
        tips: 'Dicas',
    },
    webcam_permissions: {
        allow_access            : 'Permitir acesso à câmera',
        enable_webcam_for_selfie: 'Quando solicitado, você deve habilitar o acesso à câmera para continuar',
        click_allow             : 'Não podemos verificar você sem usar sua câmera',
        allow                   : 'Permitir',
        why                     : 'Por que eu preciso fazer isso?',
        if_denied               : 'Se você negar o acesso à câmera, não poderá tirar fotos e concluir o processo de verificação.',
    },
    passport                    : 'Passaporte',
    driving_licence             : 'Carteira de condução',
    national_identity_card      : 'Carteira de identidade',
    short_passport              : 'passaporte',
    short_driving_licence       : 'Carteira de condução',
    short_national_identity_card: 'ID nacional',
    loading                     : 'Carregando',
    back                        : 'verso',
    cancel                      : 'Cancelar',
    close                       : 'Fechar',
    continue                    : 'Continuar',
};
