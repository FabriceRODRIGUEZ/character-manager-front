/**
 * A character of a user
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} gender
 * @property {string} work
 * @property {string} actor
 * @property {string} voice_actor
 * @property {string} profile
 * @property {string} comment
 * @property {number} appreciation
 */
export default class Character {

    /**
     * Constructor of the character
     * @param {string[]} properties
     */
    constructor(properties) {
        /** @type {string} */
        this.first_name = properties[0]
        /** @type {string} */
        this.last_name = properties[1]
        /** @type {string} */
        this.gender = properties[2]
        /** @type {string} */
        this.work = properties[3]
        /** @type {string} */
        this.actor = properties[4]
        /** @type {string} */
        this.voice_actor = properties[5]
        /** @type {string} */
        this.profile = properties[6]
        /** @type {string} */
        this.comment = properties[7]
        /** @type {number} */
        this.appreciation = parseInt(properties[8])
    }

}