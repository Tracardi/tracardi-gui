import {asyncRemote} from "../remote_api/entrypoint";

export default class FormSchema {

    constructor(schema) {
        this.schema = schema
    }

    async validate(pluginId, formValues) {

        const remoteValidation = async (pluginId, values) => {
            try {
                const response = await asyncRemote({
                    url: `/action/${pluginId}/config/validate`,
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

        return await remoteValidation(pluginId, formValues)
    }

}