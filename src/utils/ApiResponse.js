class ApiResponse{
    constructor(statusCode = 200, success = true, message = "Success", data = null){
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export default ApiResponse;