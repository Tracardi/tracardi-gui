import {asyncRemote} from "../remote_api/entrypoint";

export default class FormSchema {

    constructor(schema) {
        this.schema = schema
    }
    // todo remove after 01.11.2021
    // getAllFields() {
    //     if (this.schema?.groups) {
    //
    //         return this.schema?.groups?.reduce((accumulator, groupObject) => {
    //             if (groupObject.fields) {
    //                 const fields = groupObject.fields.map((item) => {
    //                     return item.id
    //                 })
    //                 return accumulator.concat(fields)
    //             }
    //             return accumulator;
    //         }, [])
    //     }
    //
    //     return []
    // }



    async validate(pluginId, formValues) {

        const remoteValidation = async (pluginId, values) => {
            try {
                await asyncRemote({
                    url: `/action/${pluginId}/config/validate`,
                    method: "POST",
                    data: values
                })

                return true;

            } catch (e) {
                if (e.response.status === 422) {
                    return e.response.data;
                }
                if (e.response.status === 404) {
                    return true
                }
            }

            return false
        }

        return await remoteValidation(pluginId, formValues)
    }

}