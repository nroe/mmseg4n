/**
 * @author Nroe
 * @package MMSeg4N.lang
 * @see java.lang.CharacterDataUndefined.java
 */
 
require("./Character.js");

Lang_CharacterDataUndefined = new JS.Class({
    /**
     * @param integer ch
     * @return integer
     */
    getProperties: function(ch)
    {
        return 0;
    },

    /**
     * @param integer ch
     * @return integer
     */
    getType: function(ch)
    {
        return Lang_Character.UNASSIGNED;
    }
});
