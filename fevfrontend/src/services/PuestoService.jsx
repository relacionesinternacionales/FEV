import axios from "axios";

const PUESTO_BASE_REST_API_URL = "http://localhost:8080/api/v1/puesto";

class PuestoService {

    async getPuestosByEmpresaId(id){
        try {
            const response = await axios.get(`${PUESTO_BASE_REST_API_URL}/empresaId/${id}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    updatePuesto(id, puesto)
    {
        return axios.put(`${PUESTO_BASE_REST_API_URL}/${id}`, puesto);
    }

    async getPuestosById(id){
        return await axios.get(`${PUESTO_BASE_REST_API_URL}/${id}`);
    }

    async createPuesto(puesto){
        return axios.post(`${PUESTO_BASE_REST_API_URL}`, puesto);
    }

    async getPuestoImage(id)
    {
        return axios({
            url: `${PUESTO_BASE_REST_API_URL}/${id}/imagen`,
            method: 'GET',
            responseType: 'blob',
            headers: {}
        });
    }

    async deletePuesto(id)
    {
        return axios.delete(`${PUESTO_BASE_REST_API_URL}/${id}`);
    }
}

export default new PuestoService();