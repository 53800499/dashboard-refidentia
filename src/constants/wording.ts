export const DASHBOARD = {
    TITLE: "Aujourd'hui",
    MAIN_CHART: {
        TITLE: "Transactions par heure",
        SUBTITLE: "Transactions par heure",
        TOTAL_LABEL: "Total aujourd'hui",
    },
}
export const DASHBOARD_COMPONENT = {
    MAINCHART: {
        TITLE: "Volume brut",
    },
    SIDE_STATS: {},
    MINI_CARD: {
        ITEM: {
            PERIODE: "période précédente ",
            PERIODE_: "vs période précédente ",
        },
        REPORTSOVERVIEW: {
            TITLE: "Votre aperçu",
            DATE: "Plage de dates",
            ACTION: "Actions",
            MODAL: {
                TITLE: "Ajouter des Graphes",
                BUTTON_CANCEL: "Annuler",
                BUTTON_APPLY: "Appliquer",
            },
            BOTTOM_SECTION: {
                CARD: {
                    TITLE: "Échecs de paiement",
                    EMPTY: "Aucune donnée"
                },
                CARD_: {
                    TITLE: "Meilleurs clients par montant dépensé",
                    INFO: "Toutes les périodes"
                }

            },
        }
    }
}

export const TRANSACTIONS_COMPONENT_FORM = {
    TITLE_MODIFICATION: "Modifier la transaction",
    TITLE_CREATION: "Nouvelle transaction",
    FORM: {
        NOM: {
            LABEL: "Nom du client",
            PLACEHOLDER: "Nom du client",
        },
        EMAIL: {
            LABEL: "Email",
            PLACEHOLDER: "Email du client",
        },
        MONTANT: {
            LABEL: "Montant (FCFA)",
            PLACEHOLDER: "Montant de la transaction",
        },
    },
    BUTTON: {
        CANCEL: "Annuler",
        UPDATE: "Mettre à jour",
        ADD: "Ajouter",
    }

}

export const TRANSACTIONS_COMPONENT_INDEX_TABLE = {
    HEADERS: "Clients",
    HEADERS_1: "Email",
    HEADERS_2: "Montant (FCFA)",
    HEADERS_3: "Méthode de paiement",
    HEADERS_4: "Statut",
    HEADERS_5: "Date",
    HEADERS_6: "Actions",
}

export const BALANCE_SUMMARY_COMPONENT = {
    HEADER: {
        TITLE: "Soldes",
        BUTTON: "Gérer les virements",
    },
    SUMMARY: {
        TITLE: "Récapitulatif du solde",
        TYPE: "Type de paiement",
        AMOUNT: "Montant",
    },
    ACTIVITY: {
        TITLE: "Activité récente",
        BUTTON_TEXT: "Virements",
        BUTTON_TEXT_: "Toutes les activités",
        EMPTY: "Aucun virement n’a été trouvé"
    },
    RIGHT_SIDEBAR: {
        TITLE: "Rapports",
        ITEM: {
            TITLE: "Récapitulatif du solde",
        },
        ITEM_: {
            TITLE: "Rapprochement des virements",
        }
    }
}
