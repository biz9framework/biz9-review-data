/*
Copyright 2016 Certified CoderZ
Author: Brandon Poole Sr. (biz9framework@gmail.com)
License GNU General Public License v3.0
Description: BiZ9 Framework: Review-Data
*/
const async = require('async');
const {Scriptz}=require("biz9-scriptz");
const {Database,Data}=require("/home/think1/www/doqbox/biz9-framework/biz9-data/source");
const {User_Field,User_Type,User_Table,User_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-user/source");
const {Review_Field,Review_Table,Review_Logic}=require("/home/think1/www/doqbox/biz9-framework/biz9-review/source");
const {Data_Logic,Data_Field,Data_Value_Type} = require("/home/think1/www/doqbox/biz9-framework/biz9-data-logic/source");
const {Log,Str,Obj,DateTime}=require("/home/think1/www/doqbox/biz9-framework/biz9-utility/source");
class Review_Data {
	//9_review_post /9_post
	static post = async(database,parent_table,parent_id,user_id,post_review,option) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			let review = Review_Logic.get(parent_table,parent_id,user_id,post_review.title,post_review.comment,post_review.rating);
			option = !Obj.check_is_empty(option) ? option : {};
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Data.post(database,Review_Table.REVIEW,review);
					data.review = biz_data;
				},
				//get_parent_item
				async function(call){
					let option = {};
					const [biz_error,biz_data] = await Data.get(database,parent_table,parent_id,option);
					data.parent_item = biz_data;
				},
				//post_item
				async function(call){
					if(!Str.check_is_null(data.parent_item.id)){
						//rating_count
						data.parent_item.rating_count = !Str.check_is_null(data.parent_item.rating_count) ? parseInt(data.parent_item.rating_count) + parseInt(review.rating) :parseInt(review.rating);
						//review_count
						data.parent_item.review_count = !Str.check_is_null(data.parent_item.review_count) ? parseInt(data.parent_item.review_count) + 1 : 1;
						//rating_avg
						data.parent_item.rating_avg = !Str.check_is_null(data.parent_item.rating_avg) ? parseInt(data.parent_item.rating_count)  /  parseInt(data.parent_item.review_count) :parseInt(review.rating);
						const [biz_error,biz_data] = await Data.post(database,parent_table,data.parent_item);
						data.parent_item = biz_data;
					}
				},
		]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-Portal",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_search 9_search
	static search = (database,filter,sort_by,page_current,page_size,option) => {
		return new Promise((callback) => {
			let data = {item_count:0,page_count:1,filter:{},table:Review_Table.REVIEW,reviews:[]};
			let error = null;
			option = !Obj.check_is_empty(option)  ? option : {};
			async.series([
				async function(call){
					const [biz_error,biz_data] = await Portal.search(database,Review_Table.REVIEW,filter,sort_by,page_current,page_size,option);
					data.item_count = biz_data.item_count;
					data.page_count = biz_data.page_count;
					data.search = biz_data.search;
					data.reviews = biz_data[Type.FIELD_ITEMS];
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Search",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_get 9_get
	static get = async (database,parent_table,parent_id,sort_by,page_current,page_size) => {
		return new Promise((callback) => {
			let error = null;
			let data = {};
			async.series([
				//reviews
				async function(call){
					let query = {parent_id:parent_id,parent_table:parent_table};
					let search = Data_Logic.get_search(Review_Table.REVIEW,query,sort_by,page_current,page_size);
					let foreign_user = Data_Logic.get_foreign(Data_Value_Type.ONE,Review_Table.USER,Data_Field.ID,Data_Field.USER_ID,{title:'user'});
					let option = {foreigns:[foreign_user]};
					const [biz_error,biz_data] = await Data.search(database,search.table,search.filter,search.sort_by,search.page_current,search.page_size,option);
					data.item_count=biz_data.item_count;
					data.page_count=biz_data.page_count;
					data.search=biz_data.search;
					data.reviews=biz_data[Data_Field.ITEMS];
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-List",err);
				callback([err,[]]);
			});
		});
	};
	//9_review_delete /9_delete
	static delete = async(database,parent_table,parent_id,review_id) => {
		return new Promise((callback) => {
			let error = null;
			let data = {parent_item:Data_Logic.get(parent_table,parent_id),review:Data_Logic.get(Review_Table.REVIEW,0)};
			let review = Data_Logic.get(Review_Table.REVIEW,review_id);
			async.series([
				//review_post
				async function(call){
					const [biz_error,biz_data] = await Data.delete(database,Review_Table.REVIEW,review.id);
					data.review = biz_data;
				},
				//get_parent_item
				async function(call){
					const [biz_error,biz_data] = await Data.get(database,parent_table,parent_id);
					data.parent_item = biz_data;
				},
				//post_item
				async function(call){
					if(!Str.check_is_null(data.parent_item.id) && data.review.delete_count>0){
						//rating_count
						data.parent_item.rating_count = !Str.check_is_null(data.parent_item.rating_count) ? parseInt(data.parent_item.rating_count) - 1 :parseInt(review.rating);
						//review_count
						data.parent_item.review_count = !Str.check_is_null(data.parent_item.review_count) ? parseInt(data.parent_item.review_count) - 1 : 1;
						//rating_avg
						data.parent_item.rating_avg = !Str.check_is_null(data.parent_item.rating_avg) ? parseInt(data.parent_item.rating_count)  /  parseInt(data.parent_item.review_count) :parseInt(review.rating);
						const [biz_error,biz_data] = await Data.post(database,parent_table,data.parent_item);
                        Log.w('66',biz_data);
						data.parent_item = biz_data;
					}
				},
			]).then(result => {
				callback([error,data]);
			}).catch(err => {
				Log.error("Review-Data-Delete-Portal",err);
				callback([err,[]]);
			});
		});
	};
}
module.exports = {
    Review_Data
};
