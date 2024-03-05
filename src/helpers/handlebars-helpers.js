export const handlebarsHelpers = {
    modAdd1: function(index, value, options) {
        if ((parseInt(index, 10) + 1) % value === 0) {
            return options.fn(this);
        }
            return options.inverse(this);
    },
    eq: function(v1, v2) {
        return v1 === v2;
    },  
};
