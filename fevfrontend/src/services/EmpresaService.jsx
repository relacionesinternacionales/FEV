import axios from "axios";

const EMPRESA_BASE_REST_API_URL = "http://localhost:8080/api/v1/empresa";

class EmpresaService {

    async getEmpresaById(id){
        try {
            console.log(id);
            return await axios.get(`${EMPRESA_BASE_REST_API_URL}/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

    async updateEmpresa(id, empresa) {
        try{
            return await axios.put(`${EMPRESA_BASE_REST_API_URL}/${id}`, empresa);
        }
        catch(error){
            console.log(error);
            return null;
        }
    }

    async getEmpresaImage(id)
    {
        return axios({
            url: `${EMPRESA_BASE_REST_API_URL}/${id}/imagen`,
            method: 'GET',
            responseType: 'blob',
            headers: {}
        });
    }

    async createEmpresa(empresa) { return axios.post(`${EMPRESA_BASE_REST_API_URL}`, empresa)}

    async getEmpresas() {
        try{
            const response = await axios.get(`${EMPRESA_BASE_REST_API_URL}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

export default new EmpresaService();