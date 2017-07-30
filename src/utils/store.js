import {Map, fromJS} from 'immutable';

let _data = Map({
    BestScore: 0
});

const Store = {
    init: function () {
        try {
            let storage = window['localStorage'];
            storage.setItem('react_2048', JSON.stringify(_data.toJS()));

        } catch (err) {
            console.log(err.message);
        }
    },

    saveBestScore: function (score) {
        localStorage.setItem('react_2048', JSON.stringify(_data.merge({
            BestScore: score
        }).toJS()));
    },

    getBestScore: function () {
        let fromSave = JSON.parse(localStorage.getItem('react_2048'));
        if (fromSave !== null) {
            fromSave = fromJS(fromSave).get('BestScore');
        }
        
        return fromSave;
    }
};

export default Store;