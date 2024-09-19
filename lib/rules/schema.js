const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        toHaveBeenCalledWith: {
            description: 'Rules that relate to the toHaveBeenCalledWith matcher',
            type: 'object',
            additionalProperties: false,
            properties: {
                strictNumberOfCalledWithMatchesCalledTimes: {
                    description: 'The number of toHaveBeenCalledWith matches the number specified in toHaveBeenCalledTimes',
                    type: 'boolean',
                },
            },
        },
        toHaveBeenNthCalledWith: {
            description: 'Rules that relate to the toHaveBeenNthCalledWith matcher',
            type: 'object',
            additionalProperties: false,
            properties: {
                strictNumberOfCalledWithMatchesCalledTimes: {
                    description:
                        'The number of toHaveBeenNthCalledWith matches the number specified in toHaveBeenCalledTimes',
                    type: 'boolean',
                },
                strictOrderOfNthCalledWith: {
                    description: 'The order of toHaveBeenNthCalledWith is ordered numerically',
                    type: 'boolean',
                },
            },
        },
        reportMessage: {
            description: 'The error message that will be reported',
            type: 'string',
        },
    },
}

module.exports = {
    schema
}
