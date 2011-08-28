/**
 * @author Nroe
 * @package MMSeg4N.lang
 * @see java.lang.CharacterDataPrivateUse.java
 */
 
require("./Character.js");
 
Lang_CharacterDataPrivateUse = new JS.Class({
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
        var offset = ch & 0xFFFF;
        if (offset == 0xFFFE || offset == 0xFFFF) {
            return Lang_Character.UNASSIGNED;
        } else {
            return Lang_Character.PRIVATE_USE;
        }
    }
});
