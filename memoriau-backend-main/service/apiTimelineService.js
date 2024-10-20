const { findAll } = require('../controller/apiTimelineController');
const db = require('../db');

module.exports = {
    findFileRecord: (email, nameAnimal) => {
        db.query(
            'SELECT * FROM file WHERE email = ? AND nameAnimal = ? AND showOnTimeline = 1', 
            [email, nameAnimal], 
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    }
}