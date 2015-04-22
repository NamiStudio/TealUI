/**

    getItem: function (name) {
        return Cookie.get(name);
    },

    setItem: function (name, value) {
        return Cookie.set(name, String(value));
    },

    removeItem: function (name) {
        Cookie.set(name, null);
    }

};