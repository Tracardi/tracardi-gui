export default class FormSchema {

    constructor(schema) {
        this.schema = schema
    }

    async validate(pluginId, microservice, formValues, request) {

        const _serverValidation = async (pluginId, microservice, values) => {
            try {

                const serviceId = (microservice?.service?.id)
                    ? microservice.service.id
                    : ""

                const actionId = (microservice?.plugin?.id)
                    ? microservice.plugin.id
                    : ""

                const response = await request({
                    url: `/plugin/${pluginId}/config/validate?service_id=${serviceId}&action_id=${actionId}`,
                    method: "POST",
                    data: {
                        config: values,
                        credentials: microservice?.plugin?.resource ? microservice.plugin.resource : null
                    }
                })

                return {
                    data: response?.data,
                    error: null,
                    status: true
                };

            } catch (e) {
                return {
                    data: e?.response?.data,
                    error: e,
                    status: false
                }
            }
        }

        return await _serverValidation(pluginId, microservice, formValues)
    }

}