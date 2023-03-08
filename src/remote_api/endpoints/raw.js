import {request} from "../remoteState";

export default class RemoteService {
    static fetch(config) {
        return request(config)
    }
}