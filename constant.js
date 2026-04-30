const Config  = {
    TITLE:'BiZ9-Review-Data'
};
const Data_Config ={
    APP_ID:'test-stage-april',
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
class Project_Table {
    static BLANK = 'blank_biz';
    static PRODUCT = 'product_biz';
    static USER = 'user_biz';
};
module.exports = {
    Config,
    Project_Table,
    Data_Config
};

