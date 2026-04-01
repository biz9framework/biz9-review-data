/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Review-Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {Review_Field,Review_Table,Review_Logic,Review_Response_Field}=require("/home/think1/www/doqbox/biz9-framework/biz9-review/source");
const {Data_Logic,Data_Field,Data_Value_Type} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Obj,DateTime,Response_Logic,Response_Field,Status_Type}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class Review_Data {
    //9_review_post /9_post
    static post = async(database,parent_table,parent_id,user_id,post_review,option) => {
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let data = {};
            let review = Review_Logic.get(parent_table,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
            option = !Obj.check_is_empty(option) ? option : {};
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_ID,Status_Type.OK,parent_id));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_USER_ID,Status_Type.OK,user_id));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_TABLE,Status_Type.OK,parent_table));
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.PARAM_REVIEW,Status_Type.OK,post_review));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_OPTION,Status_Type.OK,option));
                },
                //review
                async function(call){
                    const [biz_response,biz_data] = await Data.post(database,Review_Table.REVIEW,review);
                    data.review = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_REVIEW,Status_Type.OK,data.review));
                },
                //parent
                async function(call){
                    const [biz_response,biz_data] = await Review_Data.caculate(database,parent_table,parent_id);
                    data.parent = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_PARENT,Status_Type.OK,data.parent));
                },
                //check all
                async function(call){
                    if(!Str.check_is_null(data.review.id)){
                        response.messages.push(Response_Logic.get_message(Response_Field.POST_CONFIRM,Status_Type.SUCCESS,Review_Logic.get_message_by_response_field(Response_Field.POST_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Response_Field.POST_FAIL,Status_Type.SUCCESS,Review_Logic.get_message_by_response_field(Response_Field.POST_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Review-Data",err);
            });
        });
    };
   	//9_review_search 9_search
	static parent_search = (database,user_table,parent_table,parent_id,sort_by,page_current,page_size) => {
		return new Promise((callback) => {
		 let response=Response_Logic.get();
            let data = {};
			async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_TABLE,Status_Type.OK,parent_table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_ID,Status_Type.OK,parent_id));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_SORT_BY,Status_Type.OK,sort_by));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PAGE_CURRENT,Status_Type.OK,page_current));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PAGE_SIZE,Status_Type.OK,page_size));
                },
				async function(call){
                    let option_parent_foreign = Data_Logic.get_foreign(Data_Value_Type.ONE,parent_table,Data_Field.ID,Data_Field.PARENT_ID,{title:Data_Field.PARENT});
                    let option_user_foreign = Data_Logic.get_foreign(Data_Value_Type.ONE,user_table,Data_Field.ID,Data_Field.USER_ID,{title:Data_Field.USER});
					let search = Data_Logic.get_search(Review_Table.REVIEW,{parent_id:parent_id},{},page_current,page_size);
					const [biz_response,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,{foreigns:[option_parent_foreign,option_user_foreign]});
                    data = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_PARENT_SEARCH,Status_Type.OK,biz_response));
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_PARENT_SEARCH_ITEM_COUNT,Status_Type.OK,data.items.length));
				},
                //check all
                async function(call){
                    if(data.items){
                        response.messages.push(Response_Logic.get_message(Review_Response_Field.PARENT_SEARCH_CONFIRM,Status_Type.SUCCESS,Review_Logic.get_message_by_response_field(Review_Response_Field.PARENT_SEARCH_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Review_Response_Field.PARENT_SEARCH_FAIL,Status_Type.SUCCESS,Review_Logic.get_message_by_response_field(Review_Response_Field.PARENT_SEARCH_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
			]).then(result => {
				callback([response,data]);
			}).catch(err => {
				Log.error("Review-Data-Parent-Search",err);
			});
		});
	};
    //9_review_delete /9_delete
    static delete = async(database,parent_table,parent_id,review_id) => {
        return new Promise((callback) => {
            let response=Response_Logic.get();
            let data = {parent:Data_Logic.get(parent_table,parent_id),review:Data_Logic.get(Review_Table.REVIEW,0)};
            let review = Data_Logic.get(Review_Table.REVIEW,review_id);
            async.series([
                async function(call) {
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_APP_ID,Status_Type.OK,database.data_config.APP_ID));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_TABLE,Status_Type.OK,parent_table));
                    response.messages.push(Response_Logic.get_message(Response_Field.PARAM_PARENT_ID,Status_Type.OK,parent_id));
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.PARAM_REVIEW_ID,Status_Type.OK,review_id));
                },
                //review_delete
                async function(call){
                    const [biz_response,biz_data] = await Data.delete(database,Review_Table.REVIEW,review.id);
                    data.review = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_REVIEW_DELETE,Status_Type.OK,biz_response));
                    if(!Str.check_is_null(biz_response.status == Status_Type.SUCCESS)){
                        response.messages.push(Response_Logic.get_message(Response_Field.DELETE_CONFIRM,Status_Type.SUCCESS,Review_Logic.get_message_by_response_field(Response_Field.DELETE_CONFIRM)));
                    }else{
                        response.messages.push(Response_Logic.get_message(Response_Field.DELETE_FAIL,Status_Type.FAIL,Review_Logic.get_message_by_response_field(Response_Field.DELETE_FAIL)));
                    }
                    response = Response_Logic.get_status(response);
                },
                async function(call){
                    const [biz_response,biz_data] = await Review_Data.caculate(database,parent_table,parent_id);
                    data.parent = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.RESPONSE_CACULATE,Status_Type.OK,biz_response));
                },
            ]).then(result => {
                callback([response,data]);
            }).catch(err => {
                Log.error("Review-Data-Delete",err);
            });
        });
    };
    //9_parent_review_caculate 9_parent_caculate
    static caculate = (database,parent_table,parent_id) => {
        return new Promise((callback) => {
            let data = {};
            let response=Response_Logic.get();
            let parent = {};
            let reviews = [];
            async.series([
                async function(call){
                    //parent
                    const [biz_response,biz_data] = await Data.get(database,parent_table,parent_id);
                    parent = biz_data;
                },
                async function(call){
                    //reviews
                    let search = Data_Logic.get_search(Review_Table.REVIEW,{parent_id:parent_id},{},1,0);
                    const [biz_response,biz_data] = await Data.search(database,search.table,search.filter,{},search.page_current,search.page_size);
                    reviews = biz_data.items;
                },
                async function(call){
                    //caculate
                    let rating_count = 0;
                    let review_count = reviews.length;
                    let rating_avg = 0;
                    if(review_count > 0){
                        for(const review of reviews){
                            if(Str.check_is_null(review.rating)){
                                review.rating = 0;
                            }
                            rating_count = parseInt(rating_count) + parseInt(review.rating);
                        }
                    }
                    parent.rating_count = rating_count;
                    parent.review_count = review_count;
                    parent.rating_avg = parent.rating_count / parent.review_count;
                    const [biz_response,biz_data] = await Data.post(database,parent.table,parent);
                    data.parent = biz_data;
                    response.messages.push(Response_Logic.get_message(Review_Response_Field.Response_Caculate,Status_Type.OK,biz_response));
                },
            ]).then(result => {
                callback([response,parent]);
            }).catch(err => {
                Log.error("Review-Caculate",err);
            });
        });
    };
}
module.exports = {
    Review_Data
};
