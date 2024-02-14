export const submit = async (request, endpoint) => {
    try {
        return await request(endpoint)
    } catch (e) {
        if(e.status === 422) {
            return {
                status: 422,
                errors: e.response?.data?.detail.reduce((acc, curr) => {
                    const key = curr.loc.join('.');
                    acc[key] = curr.msg;
                    return acc;
                }, {})
            }
        }
    }
}