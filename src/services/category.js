const { default: mongoose } = require('mongoose');
const {ValidationError} = require('../errors');
const {CategoryModel} = require('../models');

exports.addCategory = async (categoryPayload) => {
    try{
        const categoryExist = await CategoryModel.findOne({
            name: categoryPayload.name
        });

        if(categoryExist){
            throw new ValidationError('category with name already exists');
        }

        const category = new CategoryModel(categoryPayload);
        await category.save();

        return {
            success: true,
            msg: 'category added',
            data: {category: category.toObject()}
        }
    } catch(error){
        throw error;
    }
}

exports.deleteCategory = async (categoryId) => {
    try{
        const category = await CategoryModel.findById(categoryId);

        if(!category){
            throw new ValidationError('invalid category id');
        }

        await CategoryModel.findByIdAndDelete(category.id);

        return {
            success: true,
            msg: 'category deleted successfuly'
        }
    } catch(error){
        throw error;
    }
}

exports.updateCategory = async (categoryId, updatePayload) => {
    try{
        const category = await CategoryModel.findById(categoryId);

        if(!category){
            throw new ValidationError('invalid category id');
        }

        if(updatePayload.name && updatePayload.name !== category.name){
            const categoryWithNameExists = await CategoryModel.findOne({
                name: updatePayload.name
            });

            if(categoryWithNameExists){
                throw new ValidationError('category with name already exists');
            }
        }

        await category.updateOne(updatePayload);

        const categoryDTO = await CategoryModel.findById(category._id).lean();
        delete categoryDTO.__v;
        return {
            success: true,
            msg: 'category data updated',
            data: {category: categoryDTO}
        }
    } catch(error){
        throw error;
    }
}
exports.setPriority = async (categoryId) => {
    try{
        const priorityCategoriesCount = await CategoryModel.count({priority: true});

        if(priorityCategoriesCount >= 6){
            throw new ValidationError('Six categories are already set to priority');
        }

        const category = await CategoryModel.findById(categoryId);
        if(!category){
            throw new ValidationError('invalid category id');
        }

        category.priority = true;
        await category.save();

        return {
            success: true,
            msg: 'successfuly set priority to true'
        }
    } catch(error){
        throw error;
    }
}

exports.removePriority = async (categoryId) => {
    try{
        const category = await CategoryModel.findById(categoryId);
        if(!category){
            throw new ValidationError('invalid category id');
        }

        category.priority = false;
        await category.save();

        return {
            success: true,
            msg: 'successfuly set priority to false'
        }
    } catch(error){
        throw error;
    }
}

exports.getPriorityCategories = async () => {
    try{
        const categories = await CategoryModel.find({
            priority: true
        }).lean();

        categories.forEach((category) => {
            delete category.__v;
        })
        return {
            success: true,
            msg: 'priority categories',
            data: {categories: categories}
        }
    } catch(error){
        throw error;
    }
}

exports.getCategories = async (page) => {
    try{
        let numOfCategoriesOnPage = 18;
        let priorityCategories = [];
        if(page === 0){
            priorityCategories = await CategoryModel.find({
                priority: true
            }).lean();

            console.log(priorityCategories);
            numOfCategoriesOnPage -= priorityCategories.length;
        }

        const categories = await CategoryModel.find({priority: false}).sort({createdAt: -1})
        .skip(page).limit(numOfCategoriesOnPage).lean();
        const categoriesDTO = [...priorityCategories, ...categories];
        categoriesDTO.forEach((category) => {
            delete category.__v;
        })

        return {
            msg: "categories",
            data: {categories: categoriesDTO}
        }
    } catch(error){
        throw error;
    }
}