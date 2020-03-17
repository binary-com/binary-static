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
            enlarge: 'Ampliar imagem',
            close  : 'Fechar',
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
            button_copy: {
                action: 'Enviar link',
                status: 'Enviando',
            },
            qr_code: {
                help_label : 'Como digitalizar um código QR',
                help_step_1: 'Aponte a câmera do seu telefone para o código QR',
                help_step_2: 'Se não funcionar, baixe um scanner de código QR no Google Play ou na App Store',
            },
            sms_label      : 'Digite seu número de celular:',
            copy_link_label: 'Copie o link para o seu navegador no celular',
        },
        submit: {
            title                 : 'Ótimo, é tudo o que precisamos',
            sub_title             : 'Agora estamos prontos para verificar sua identidade',
            selfie_uploaded       : 'Selfie enviada',
            video_uploaded        : 'Video enviado',
            action                : 'Enviar verificação',
            multiple_docs_uploaded: 'Documentos enviados',
            one_doc_uploaded      : 'Documento enviado',
        },
        phone_number_placeholder: 'Digite o número do celular',
        loading                 : 'Carregando...',
        mobile_connected        : {
            title: {
                message   : 'Conectado ao seu celular',
                submessage: 'Quando terminar, levaremos você para o próximo passo',
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
            bold_message: 'Pode demorar alguns minutos para chegar',
            tips        : {
                item_1: 'Mantenha essa janela aberta enquanto estiver usando seu celular',
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
        enable_webcam           : 'Ativar câmera',
        access_denied           : 'Acesso à câmera negado',
        recover_access          : 'Recupere o acesso da câmera para continuar a verificação de rosto',
        recovery                : 'Recuperação',
        follow_steps            : 'Siga estas etapas para recuperar o acesso da câmera:',
        grant_access            : 'Conceda acesso à sua câmera a partir das configurações do navegador',
        refresh_page            : 'Atualize esta página para reiniciar o processo de verificação de identidade',
        refresh                 : 'Atualizar',
    },
    errors: {
        invalid_capture: {
            message    : 'Nenhum documento detectado',
            instruction: 'Verifique se todo o documento está na foto',
        },
        invalid_type: {
            message    : 'Arquivo não carregado.',
            instruction: 'Tente enviar outro tipo de arquivo.',
        },
        unsupported_file: {
            message    : 'Tipo de arquivo não suportado',
            instruction: 'Tente usar um arquivo JPG ou PNG',
        },
        invalid_size: {
            message    : 'Tamanho do arquivo excedido.',
            instruction: 'Deve ter menos de 10 MB.',
        },
        no_face: {
            message    : 'Nenhum rosto encontrado',
            instruction: 'Seu rosto é necessário na selfie',
        },
        multiple_faces: {
            message    : 'Mais de um rosto encontrado',
            instruction: 'Somente seu rosto pode estar na selfie',
        },
        server_error: {
            message    : 'Conexão perdida',
            instruction: 'Por favor, tente novamente',
        },
        glare_detected: {
            message    : 'Brilho detectado',
            instruction: 'Todos os detalhes devem ser nítidos e legíveis',
        },
        sms_failed: {
            message    : 'Algo deu errado',
            instruction: 'Copie o link para o seu telefone',
        },
        sms_overuse: {
            message    : 'Muitas tentativas falhas',
            instruction: 'Copie o link para o seu telefone',
        },
        lazy_loading: {
            message: 'Ocorreu um erro ao carregar o componente',
        },
        invalid_number: {
            message: 'Verifique se o seu número está correto',
        },
        generic_client_error: {
            message    : 'Algo deu errado',
            instruction: 'Você precisará reiniciar sua verificação no seu computador',
        },
        forbidden_client_error: {
            message    : 'Algo deu errado',
            instruction: 'O link funciona apenas em dispositivos móveis',
        },
        camera_not_working: {
            message    : 'A câmera não está funcionando',
            instruction: 'Pode estar desconectado. <fallback>Tente usar seu telefone</fallback>.',
        },
        camera_inactive: {
            message    : 'Está tendo problemas com a câmera?',
            instruction: '<fallback>Use seu celular</fallback> para continuar a verificação de rosto',
        },
        interrupted_flow_error: {
            message    : 'Câmera não detectada',
            instruction: 'Reinicie o processo em um dispositivo diferente',
        },
        unsupported_android_browser: {
            message    : 'Navegador não suportado',
            instruction: 'Reinicie o processo na versão mais recente do Google Chrome',
        },
        unsupported_ios_browser: {
            message    : 'Navegador não suportado',
            instruction: 'Reinicie o processo na versão mais recente do Safari',
        },
    },
    accessibility: {
        close_sdk_screen         : 'Fechar tela de verificação de identidade',
        dismiss_alert            : 'Fechar alerta',
        camera_view              : 'Vista da câmera',
        shutter                  : 'Tire uma foto',
        document_types           : 'Documentos que você pode usar para verificar sua identidade',
        selfie_video_actions     : 'Ações para gravar uma selfie em vídeo',
        cross_device_verification: 'Etapas necessárias para continuar a verificação no seu celular',
        country_select           : 'Selecione o país',
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
