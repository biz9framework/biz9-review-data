/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Review-Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {Data_Logic} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {User_Logic,User_Table} = require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Review_Logic,Review_Table} = require("/home/think1/www/doqbox/biz9-framework/biz9-review/source");
const {Log,Str,Obj,Num,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Review_Data}=require("./index");

/*
 * availble tests
- connect
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-feb22';
const DATA_CONFIG ={
    APP_ID:APP_ID,
    MONGO_IP:'0.0.0.0',
    MONGO_USERNAME_PASSWORD:'',
    MONGO_PORT_ID:"27019",
    MONGO_SERVER_USER:'admin',
    MONGO_CONFIG_FILE_PATH:'/etc/mongod.conf',
    MONGO_SSH_KEY:"",
    REDIS_URL:"0.0.0.0",
    REDIS_PORT_ID:"27019"
};
/* --- TEST CONFIG END --- */

/* --- DATA CONFIG END --- */
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let error=null;
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_error,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                //-->
                let print_test = true;
                // -- ITEM-POST -- START
                /*
                let parent = User_Logic.get_test_user();
                //let parent = Data_Logic.get(Review_Table.BLANK,0,{data:{field_1:'field_1'+Num.get_id(),field_2:'field_2'+Num.get_id()}});
                //let sub_items = Data_Logic.get(Store_Table.PRODUCT,0,{test:true,count:5,data:Store_Logic.get_test_product()});
                const [biz_error,biz_data] = await Data.post(database,parent.table,parent);
                //const [biz_error,biz_data] = await Data.post_items(database,sub_items);
                */
                // -- ITEM-POST -- END
                //-- REVIEW-POST START --//
                /*
                let user = Data_Logic.get(User_Table.USER,'522');
                let parent = Data_Logic.get(Review_Table.BLANK,'518');
                let review = Review_Logic.get_test();
                const [biz_error,biz_data] = await Review_Data.post(database,parent.table,parent.id,user.id,review);
                */
                //
                //-- REVIEW-DELETE START --//
                let review_id = '181';
                let user = Data_Logic.get(User_Table.USER,'522');
                let parent = Data_Logic.get(Review_Table.BLANK,'518');
                const [biz_error,biz_data] = await Review_Data.delete(database,parent.table,parent.id,review_id);
                //-- REVIEW-DELETE END --//
                //
                //-- REVIEW-GET START --//
                /*
                let user = Data_Logic.get(User_Table.USER,'522');
                let parent = Data_Logic.get(Review_Table.BLANK,'518');
                let review = Review_Logic.get_test();
                const [biz_error,biz_data] = await Review_Data.get(database,parent.table,parent.id,{},1,0);
                */
                //-- REVIEW-GET END --//


                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                }
            },
        ],
            function(error, result){
                console.log('CONNECT-DONE');
                done();
            });
    });
});

