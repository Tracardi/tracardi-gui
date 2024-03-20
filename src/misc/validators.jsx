import {convertNamedEntityToIdName} from "./converters";
import * as yup from "yup";

export function getRequiredEntityNameSchema(errorMessage = 'Can not be empty') {
    return yup.object().shape({
        name: yup.string().required(errorMessage),
    });
}

export function getRequiredStringSchema(errorMessage = 'Can not be empty') {
    return yup.string().required(errorMessage)
}

export async function validateYupSchema(schema, data) {
    return await schema.validate(data, { abortEarly: false })
        .then(() => null)
        .catch(validationError => {
            const errors = validationError.inner.map(error => {
                return {
                    id: error.path,
                    name: error.message,
                };
            });
            return convertNamedEntityToIdName(errors)
        });
}