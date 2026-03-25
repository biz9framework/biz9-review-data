/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Review-Data - Test
*/
const async = require('async');
const assert = require('node:assert');
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {Store_Logic,Store_Table} = require("/home/think1/www/doqbox/biz9-framework/biz9-store/source");
const {Data_Logic} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {User_Logic,User_Table} = require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Review_Logic,Review_Table} = require("/home/think1/www/doqbox/biz9-framework/biz9-review/source");
const {Log,Str,Obj,Num,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
const {Review_Data}=require("./index");

/*
 * availble tests
- connect
- review_data_get
- review_data_delete
- review_data_post
- review_data_search
*/
/* --- TEST CONFIG START --- */
const APP_ID = 'test-stage-march25';
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

/* --- Project CONFIG START --- */
class Project_Table {
    static BLANK='blank_biz';
    static PRODUCT='product_biz';
}
//9_connect - 9_test_connect
describe('connect', function(){ this.timeout(25000);
    it("_connect", function(done){
        let response={};
        let database = {};
        let data = {};
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },

            async function(call){
                //-->
                let print_test = true;
                // -- ITEM-POST -- START
                /*
                //let parent = User_Logic.get_test_user();
                let parent = Data_Logic.get(Review_Table.BLANK,0,{data:{field_1:'field_1'+Num.get_id(),field_2:'field_2'+Num.get_id()}});
                //let sub_items = Data_Logic.get(Store_Table.PRODUCT,0,{test:true,count:20,data:Store_Logic.get_test_product()});
                const [biz_response,biz_data] = await Data.post(database,parent.table,parent);
                //const [biz_response,biz_data] = await Data.post_items(database,sub_items);
                */
                // -- ITEM-POST -- END
                //-- REVIEW-POST START --//
                /*
                let user = Data_Logic.get(User_Table.USER,'869');
                let parent = Data_Logic.get(Review_Table.BLANK,'705');
                let review = Review_Logic.get_test();
                const [biz_response,biz_data] = await Review_Data.post(database,parent.table,parent.id,user.id,review);
                */
                //
                //-- REVIEW-DELETE START --//
                let review_id = '728';
                let user = Data_Logic.get(User_Table.USER,'522');
                let parent = Data_Logic.get(Review_Table.BLANK,'705');
                const [biz_response,biz_data] = await Review_Data.delete(database,parent.table,parent.id,review_id);
                //-- REVIEW-DELETE END --//
                //
                //-- REVIEW-GET START --//
                /*
                let user = Data_Logic.get(User_Table.USER,'522');
                let parent = Data_Logic.get(Review_Table.BLANK,'518');
                let review = Review_Logic.get_test();
                const [biz_response,biz_data] = await Review_Data.get(database,parent.table,parent.id,{},1,0);
                */
                //-- REVIEW-GET END --//


                if(print_test){;
                    Log.w('99_biz_data',biz_data);
                }
            },
        ],
            function(error, result){
                Log.w('CONNECT-DONE',error);
                done();
            });
    });
});
//9_post - 9_review_post
describe('review_data_post', function(){ this.timeout(25000);
    it("_review_data_post", function(done){
        console.log('REVIEW-DATA-POST-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let parent = {};
        let user = User_Logic.get_test_user();
        let review = Review_Logic.get_test();
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                // -- new-product-start --
                /*
                parent = Store_Logic.get_test_product({title:'Product '+Str.get_id()});
                parent.rating_avg = 0;
                parent.rating_count = 0;
                parent.review_count = 0;
                const [biz_response,biz_data] = await Data.post(database,parent.table,parent);
                parent = biz_data;
                */
                // -- new-product-end --
                // -- update-product-start --

                parent = Data_Logic.get(Project_Table.PRODUCT,'641');
                const [biz_response,biz_data] = await Data.get(database,parent.table,parent.id);
                parent = biz_data;

                // -- update-product-start --
            },
            async function(call){
                //user
                const [biz_response,biz_data] = await Data.post(database,user.table,user);
                user = biz_data;
            },
           async function(call){
                const [biz_response,biz_data] = await Review_Data.post(database,parent.table,parent.id,user.id,review);
                review = biz_data.review;
            },
            async function(call){
                console.log('---user-start---');
                console.log('ID='+user.id + '---UserName='+user.username+'---Email='+user.email);
                console.log('---user-end---');
                console.log('---parent-start---');
                console.log('ID='+parent.id + '---Title='+parent.title);
                console.log('Rating_Avg='+parent.rating_avg + '---Rating_Count='+parent.rating_count + '---Review_Count='+parent.review_count );
                console.log('---parent-end---');
                console.log('---review-start---');
                console.log('ID='+review.id+'---Review-Title='+review.title +'---Review-Comment='+ review.comment);
                console.log('---review-end---');
                console.log('REVIEW-DATA-POST-SUCCESS');
            },
        ],
            function(error, result){
                console.log('REVIEW-DATA-POST-DONE');
                done();
            });
    });
});

//9_get - 9_review_get
describe('review_data_get', function(){ this.timeout(25000);
    it("_review_data_get", function(done){
        console.log('REVIEW-DATA-GET-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let user_id = "699";
        let parent_table = Store_Table.PRODUCT;
        let parent_id = "315";
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Review_Data.get(database,parent_table,parent_id,{},1,0);
                data = biz_data;
                Log.w('biz_data',biz_data);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('---user-start---');
                console.log('ID='+user_id);
                console.log('---user-end---');
                console.log('---parent-start---');
                console.log('ID='+parent.id + '---Title='+parent.title);
                console.log('Rating_Avg='+parent.rating_avg + '---Rating_Count='+parent.rating_count + '---Review_Count='+parent.review_count );
                console.log('---parent-end---');
                console.log('---review-start---');
                console.log('Review-Title='+review.title +'Review-Comment='+ review.comment);
                console.log('---review-end---');
                console.log('REVIEW-DATA-GET-SUCCESS');
            },
        ],
            function(error, result){
                Log.error('REVIEW-DATA-GET-DONE',error);
                done();
            });
    });
});
//9_delete - 9_review_delete
describe('review_data_delete', function(){ this.timeout(25000);
    it("_review_data_delete", function(done){
        console.log('REVIEW-DATA-DELETE-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let parent = {};
        let parent_table = Store_Table.PRODUCT;
        let parent_id = "641";
        let review_id = "302";
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(DATA_CONFIG);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Review_Data.delete(database,parent_table,parent_id,review_id);
                data = biz_data;
                parent = biz_data.parent;
                Log.w('biz_data_parent',parent);
                Log.w('biz_response',biz_response);
            },
            async function(call){
                console.log('---parent-start---');
                console.log('ID='+parent.id + '---Title='+parent.title);
                console.log('Rating_Avg='+parent.rating_avg + '---Rating_Count='+parent.rating_count + '---Review_Count='+parent.review_count );
                console.log('---parent-end---');
               console.log('REVIEW-DATA-DELETE-SUCCESS');
            },
        ],
            function(error, result){
                Log.error('REVIEW-DATA-DELETE-DONE',error);
                done();
            });
    });
});

