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
const {Config,Data_Config,Project_Table}=require("./constant");

/*
 * - 9_DEFINE -
 *   review_delete
 *   review_post
 *   review_parent_search
*/
//9_post - 9_review_post
describe('review_post', function(){ this.timeout(25000);
    it("_review_post", function(done){
        console.log('REVIEW-DATA-POST-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        // -- USER START -- //
        // -- new user start --
        //let user = User_Logic.get_test_user();
        // -- new user end --
        // -- update user start //
        let user = Data_Logic.get(User_Table.USER,'69f356eb877ecbb2fbba0745');
        // -- update user end //
        // -- USER END -- //
        // -- PARENT START -- //
        // -- new parent start -- //
        //let parent = Store_Logic.get_test_product({title:'Product '+Str.get_id()});
        //parent.rating_avg = 0;
        //parent.rating_count = 0;
        //parent.review_count = 0;
        // -- new parent end -- //
        // -- update parent start -- //
        let parent = Data_Logic.get(Store_Table.PRODUCT,'69f356eb877ecbb2fbba06f2');
        // -- update parent end -- //
        // -- PARENT END -- //
        let review = Review_Logic.get_test();
        async.series([
            async function(call){
                // -- database --
                const [biz_response,biz_data] = await Database.get(Data_Config);
                database = biz_data;
            },
            async function(call){
                // -- post-user --
                if(Str.check_is_null(user.id)){
                    const [biz_response,biz_data] = await Data.post(database,user.table,user);
                    user = biz_data;
                }
            },
            async function(call){
                // -- post-parent --
                if(Str.check_is_null(parent.id)){
                    const [biz_response,biz_data] = await Data.post(database,parent.table,parent);
                    parent = biz_data;
                }
            },
            async function(call){
                // -- review-post --
                const [biz_response,biz_data] = await Review_Data.post(database,parent.table,parent.id,User_Table.USER,user.id,review);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
                review = biz_data;
            },
        ],
            function(error, result){
                Log.w('biz_user',user);
                Log.w('biz_parent',parent);
                Log.w('biz_review',review);

                console.log('-- user_id -- '+ user.id);
                console.log('-- parent_id -- '+ parent.id);
                console.log('-- review_id -- '+ review.review.id);
                console.log('REVIEW-DATA-POST-DONE');
                done();
            });
    });
});
//9_delete - 9_review_delete
describe('review_delete', function(){ this.timeout(25000);
    it("_review_delete", function(done){
        console.log('REVIEW-DATA-DELETE-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let parent = {};
        let parent_table = Store_Table.PRODUCT;
        let parent_id = '69f356eb877ecbb2fbba06f2';
        let review_id = "69f3853116612605a9ddd76b";
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(Data_Config);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Review_Data.delete(database,parent_table,parent_id,review_id);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
                console.log('REVIEW-DATA-DELETE-SUCCESS');
            },
        ],
            function(error, result){
                console.log('REVIEW-DATA-DELETE-DONE');
                done();
            });
    });
});
//9_parent_search - 9_review_parent_search 9_search
describe('review_parent_search', function(){ this.timeout(25000);
    it("_review_parent_search", function(done){
        console.log('REVIEW-DATA-PARENT-SEARCH-START');
        let response={};
        let database = {};
        let data = {};
        let option = {};
        let parent_id = '69f356eb877ecbb2fbba06f2';
        let parent_table = Project_Table.PRODUCT;
        let user_table = Project_Table.USER;
        async.series([
            async function(call){
                const [biz_response,biz_data] = await Database.get(Data_Config);
                database = biz_data;
            },
            async function(call){
                const [biz_response,biz_data] = await Review_Data.parent_search(database,user_table,parent_table,parent_id,{},1,0);
                Log.w('99_biz_response',biz_response);
                Log.w('99_biz_data',biz_data);
                console.log('REVIEW-DATA-PARENT-SEARCH-SUCCESS');
            },
        ],
            function(error, result){
                console.log('REVIEW-DATA-PARENT-SEARCH-DONE');
                done();
            });
    });
});

