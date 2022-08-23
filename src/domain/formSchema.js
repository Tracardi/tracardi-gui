import {asyncRemote} from "../remote_api/entrypoint";

export default class FormSchema {

    constructor(schema) {
        this.schema = schema
    }

    async validate(pluginId, microservice, formValues) {

        const _serverValidation = async (pluginId, microservice, values) => {
            try {

                const serviceId = (microservice?.resource?.current?.service?.id)
                    ? microservice.resource.current.service.id
                    : ""

                const actionId = (microservice?.plugin.id)
                    ? microservice.plugin.id
                    : ""

                const response = await asyncRemote({
                    url: `/plugin/${pluginId}/config/validate?service_id=${serviceId}&action_id=${actionId}`,
                    method: "POST",
                    data: values
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