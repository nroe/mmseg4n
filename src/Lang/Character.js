/**
 * @author Nroe
 * @package MMSeg4N
 * @see java.lang.character.java
 */
 
require("./CharacterData00.js");
require("./CharacterData01.js");
require("./CharacterData02.js");
require("./CharacterData0E.js");
require("./CharacterDataLatin1.js");
require("./CharacterDataPrivateUse.js");
require("./CharacterDataUndefined.js");

Lang_Character = new JS.Class({
    /**
     * Provide the character plane to which this codepoint belongs.
     * 
     * @param ch the codepoint
     * @return the plane of the codepoint argument
     */
    getPlane: function(ch)
    {
        return (ch >>> 16);
    },
    
    /**
     * Returns a value indicating a character's general category.
     *
     * @param   codePoint the character (Unicode code point) to be tested.
     * @return  a value of type <code>int</code> representing the 
     *          character's general category.
     * @see     Lang_Character#COMBINING_SPACING_MARK COMBINING_SPACING_MARK
     * @see     Lang_Character#CONNECTOR_PUNCTUATION CONNECTOR_PUNCTUATION
     * @see     Lang_Character#CONTROL CONTROL
     * @see     Lang_Character#CURRENCY_SYMBOL CURRENCY_SYMBOL
     * @see     Lang_Character#DASH_PUNCTUATION DASH_PUNCTUATION
     * @see     Lang_Character#DECIMAL_DIGIT_NUMBER DECIMAL_DIGIT_NUMBER
     * @see     Lang_Character#ENCLOSING_MARK ENCLOSING_MARK
     * @see     Lang_Character#END_PUNCTUATION END_PUNCTUATION
     * @see     Lang_Character#FINAL_QUOTE_PUNCTUATION FINAL_QUOTE_PUNCTUATION
     * @see     Lang_Character#FORMAT FORMAT
     * @see     Lang_Character#INITIAL_QUOTE_PUNCTUATION INITIAL_QUOTE_PUNCTUATION
     * @see     Lang_Character#LETTER_NUMBER LETTER_NUMBER
     * @see     Lang_Character#LINE_SEPARATOR LINE_SEPARATOR
     * @see     Lang_Character#LOWERCASE_LETTER LOWERCASE_LETTER
     * @see     Lang_Character#MATH_SYMBOL MATH_SYMBOL
     * @see     Lang_Character#MODIFIER_LETTER MODIFIER_LETTER
     * @see     Lang_Character#MODIFIER_SYMBOL MODIFIER_SYMBOL
     * @see     Lang_Character#NON_SPACING_MARK NON_SPACING_MARK
     * @see     Lang_Character#OTHER_LETTER OTHER_LETTER
     * @see     Lang_Character#OTHER_NUMBER OTHER_NUMBER
     * @see     Lang_Character#OTHER_PUNCTUATION OTHER_PUNCTUATION
     * @see     Lang_Character#OTHER_SYMBOL OTHER_SYMBOL
     * @see     Lang_Character#PARAGRAPH_SEPARATOR PARAGRAPH_SEPARATOR
     * @see     Lang_Character#PRIVATE_USE PRIVATE_USE
     * @see     Lang_Character#SPACE_SEPARATOR SPACE_SEPARATOR
     * @see     Lang_Character#START_PUNCTUATION START_PUNCTUATION
     * @see     Lang_Character#SURROGATE SURROGATE
     * @see     Lang_Character#TITLECASE_LETTER TITLECASE_LETTER
     * @see     Lang_Character#UNASSIGNED UNASSIGNED
     * @see     Lang_Character#UPPERCASE_LETTER UPPERCASE_LETTER
     */
    getType: function(codePoint)
    {
        var type = Lang_Character.UNASSIGNED;
        
        if (codePoint >= Lang_Character.MIN_CODE_POINT && codePoint <= Lang_Character.FAST_PATH_MAX) {
            type = Lang_CharacterDataLatin1.prototype.getType(codePoint);
        } else {
            var plane = Lang_Character.prototype.getPlane(codePoint);
            switch(plane) {
                case(0):
                    type = Lang_CharacterData00.prototype.getType(codePoint);
                    break;
                case(1):
                     type = Lang_CharacterData01.prototype.getType(codePoint);
                    break;
                case(2):
                     type = Lang_CharacterData02.prototype.getType(codePoint);
                    break;
                case(3): // Undefined
                case(4): // Undefined
                case(5): // Undefined
                case(6): // Undefined
                case(7): // Undefined
                case(8): // Undefined
                case(9): // Undefined
                case(10): // Undefined
                case(11): // Undefined
                case(12): // Undefined
                case(13): // Undefined      
                    type = Lang_CharacterDataUndefined.prototype.getType(codePoint);
                    break;
                case(14): 
                     type = Lang_CharacterData0E.prototype.getType(codePoint);
                    break;
                case(15): // Private Use
                case(16): // Private Use
                     type = Lang_CharacterDataPrivateUse.prototype.getType(codePoint);
                    break;
                default:
                    // the argument's plane is invalid, and thus is an invalid codepoint
                    // type remains UNASSIGNED
                    break;
            }
        }
        
        return type;
    }
});

/**
 * The minimum value of a Unicode code point.
 * 
 * @since 1.5
 */
Lang_Character.MIN_CODE_POINT = 0x000000;

/**
 * The maximum value of a Unicode code point.
 *
 * @since 1.5
 */
Lang_Character.MAX_CODE_POINT = 0x10ffff;

// Maximum character handled by internal fast-path code which
// avoids initializing large tables.
// Note: performance of this "fast-path" code may be sub-optimal
// in negative cases for some accessors due to complicated ranges.
// Should revisit after optimization of table initialization.
Lang_Character.FAST_PATH_MAX = 255;

/**
 * The minimum radix available for conversion to and from strings.
 * The constant value of this field is the smallest value permitted
 * for the radix argument in radix-conversion methods such as the
 * <code>digit</code> method, the <code>forDigit</code>
 * method, and the <code>toString</code> method of class
 * <code>Integer</code>.
 *
 * @see     java.lang.Lang_Character#digit(char, int)
 * @see     java.lang.Lang_Character#forDigit(int, int)
 * @see     java.lang.Integer#toString(int, int)
 * @see     java.lang.Integer#valueOf(java.lang.String)
 */
Lang_Character.MIN_RADIX = 2;

/**
 * The maximum radix available for conversion to and from strings.
 * The constant value of this field is the largest value permitted
 * for the radix argument in radix-conversion methods such as the
 * <code>digit</code> method, the <code>forDigit</code>
 * method, and the <code>toString</code> method of class
 * <code>Integer</code>.
 *
 * @see     java.lang.Lang_Character#digit(char, int)
 * @see     java.lang.Lang_Character#forDigit(int, int)
 * @see     java.lang.Integer#toString(int, int)
 * @see     java.lang.Integer#valueOf(java.lang.String)
 */
Lang_Character.MAX_RADIX = 36;

/**
 * The constant value of this field is the smallest value of type
 * <code>char</code>, <code>'&#92;u0000'</code>.
 */
Lang_Character.MIN_VALUE = '\u0000';

/**
 * The constant value of this field is the largest value of type
 * <code>char</code>, <code>'&#92;uFFFF'</code>.
 */
Lang_Character.MAX_VALUE = '\uffff';
    
    
   /**
* General category "Cn" in the Unicode specification.
* @since   1.1
*/
Lang_Character.UNASSIGNED             = 0;

   /**
* General category "Lu" in the Unicode specification.
* @since   1.1
*/
Lang_Character.UPPERCASE_LETTER            = 1;

   /**
* General category "Ll" in the Unicode specification.
* @since   1.1
*/
Lang_Character.LOWERCASE_LETTER            = 2;

   /**
* General category "Lt" in the Unicode specification.
* @since   1.1
*/
Lang_Character.TITLECASE_LETTER            = 3;

   /**
* General category "Lm" in the Unicode specification.
* @since   1.1
*/
Lang_Character.MODIFIER_LETTER             = 4;

   /**
* General category "Lo" in the Unicode specification.
* @since   1.1
*/
Lang_Character.OTHER_LETTER                = 5;

   /**
* General category "Mn" in the Unicode specification.
* @since   1.1
*/
Lang_Character.NON_SPACING_MARK            = 6;

   /**
* General category "Me" in the Unicode specification.
* @since   1.1
*/
Lang_Character.ENCLOSING_MARK              = 7;

   /**
* General category "Mc" in the Unicode specification.
* @since   1.1
*/
Lang_Character.COMBINING_SPACING_MARK      = 8;

   /**
* General category "Nd" in the Unicode specification.
* @since   1.1
*/
Lang_Character.DECIMAL_DIGIT_NUMBER        = 9;

   /**
* General category "Nl" in the Unicode specification.
* @since   1.1
*/
Lang_Character.LETTER_NUMBER               = 10;

   /**
* General category "No" in the Unicode specification.
* @since   1.1
*/
Lang_Character.OTHER_NUMBER                = 11;

   /**
* General category "Zs" in the Unicode specification.
* @since   1.1
*/
Lang_Character.SPACE_SEPARATOR             = 12;

   /**
* General category "Zl" in the Unicode specification.
* @since   1.1
*/
Lang_Character.LINE_SEPARATOR              = 13;

   /**
* General category "Zp" in the Unicode specification.
* @since   1.1
*/
Lang_Character.PARAGRAPH_SEPARATOR         = 14;

   /**
* General category "Cc" in the Unicode specification.
* @since   1.1
*/
Lang_Character.CONTROL                     = 15;

   /**
* General category "Cf" in the Unicode specification.
* @since   1.1
*/
Lang_Character.FORMAT                      = 16;

   /**
* General category "Co" in the Unicode specification.
* @since   1.1
*/
Lang_Character.PRIVATE_USE                 = 18;

   /**
* General category "Cs" in the Unicode specification.
* @since   1.1
*/
Lang_Character.SURROGATE                   = 19;

   /**
* General category "Pd" in the Unicode specification.
* @since   1.1
*/
Lang_Character.DASH_PUNCTUATION            = 20;

   /**
* General category "Ps" in the Unicode specification.
* @since   1.1
*/
Lang_Character.START_PUNCTUATION           = 21;

   /**
* General category "Pe" in the Unicode specification.
* @since   1.1
*/
Lang_Character.END_PUNCTUATION             = 22;

   /**
* General category "Pc" in the Unicode specification.
* @since   1.1
*/
Lang_Character.CONNECTOR_PUNCTUATION       = 23;

   /**
* General category "Po" in the Unicode specification.
* @since   1.1
*/
Lang_Character.OTHER_PUNCTUATION           = 24;

   /**
* General category "Sm" in the Unicode specification.
* @since   1.1
*/
Lang_Character.MATH_SYMBOL                 = 25;

   /**
* General category "Sc" in the Unicode specification.
* @since   1.1
*/
Lang_Character.CURRENCY_SYMBOL             = 26;

   /**
* General category "Sk" in the Unicode specification.
* @since   1.1
*/
Lang_Character.MODIFIER_SYMBOL             = 27;

   /**
* General category "So" in the Unicode specification.
* @since   1.1
*/
Lang_Character.OTHER_SYMBOL                = 28;

   /**
* General category "Pi" in the Unicode specification.
* @since   1.4
*/
Lang_Character.INITIAL_QUOTE_PUNCTUATION   = 29;

   /**
* General category "Pf" in the Unicode specification.
* @since   1.4
*/
Lang_Character.FINAL_QUOTE_PUNCTUATION     = 30;

/**
 * Error flag. Use int (code point) to avoid confusion with U+FFFF.
 */
Lang_Character.ERROR = 0xFFFFFFFF;


/**
 * Undefined bidirectional character type. Undefined <code>char</code>
 * values have undefined directionality in the Unicode specification.
 * @since 1.4
 */
 Lang_Character. DIRECTIONALITY_UNDEFINED = -1;

/**
 * Strong bidirectional character type "L" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_LEFT_TO_RIGHT = 0;

/**
 * Strong bidirectional character type "R" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_RIGHT_TO_LEFT = 1;

/**
* Strong bidirectional character type "AL" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_RIGHT_TO_LEFT_ARABIC = 2;

/**
 * Weak bidirectional character type "EN" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_EUROPEAN_NUMBER = 3;

/**
 * Weak bidirectional character type "ES" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_EUROPEAN_NUMBER_SEPARATOR = 4;

/**
 * Weak bidirectional character type "ET" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_EUROPEAN_NUMBER_TERMINATOR = 5;

/**
 * Weak bidirectional character type "AN" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_ARABIC_NUMBER = 6;

/**
 * Weak bidirectional character type "CS" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_COMMON_NUMBER_SEPARATOR = 7;

/**
 * Weak bidirectional character type "NSM" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_NONSPACING_MARK = 8;

/**
 * Weak bidirectional character type "BN" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_BOUNDARY_NEUTRAL = 9;

/**
 * Neutral bidirectional character type "B" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_PARAGRAPH_SEPARATOR = 10;

/**
 * Neutral bidirectional character type "S" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_SEGMENT_SEPARATOR = 11;

/**
 * Neutral bidirectional character type "WS" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_WHITESPACE = 12;

/**
 * Neutral bidirectional character type "ON" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_OTHER_NEUTRALS = 13;

/**
 * Strong bidirectional character type "LRE" in the Unicode specification.
 * @since 1.4
 */
Lang_Character. DIRECTIONALITY_LEFT_TO_RIGHT_EMBEDDING = 14;

/**
 * Strong bidirectional character type "LRO" in the Unicode specification.
 */
Lang_Character. DIRECTIONALITY_LEFT_TO_RIGHT_OVERRIDE = 15;

/**
 * Strong bidirectional character type "RLE" in the Unicode specification.
 */
Lang_Character.DIRECTIONALITY_RIGHT_TO_LEFT_EMBEDDING = 16;

/**
 * Strong bidirectional character type "RLO" in the Unicode specification.
 */
Lang_Character. DIRECTIONALITY_RIGHT_TO_LEFT_OVERRIDE = 17;

/**
 * Weak bidirectional character type "PDF" in the Unicode specification.
 */
Lang_Character. DIRECTIONALITY_POP_DIRECTIONAL_FORMAT = 18;

/**
 * The minimum value of a Unicode high-surrogate code unit in the
 * UTF-16 encoding. A high-surrogate is also known as a
 * <i>leading-surrogate</i>.
 */
Lang_Character.MIN_HIGH_SURROGATE = '\uD800';

/**
 * The maximum value of a Unicode high-surrogate code unit in the
 * UTF-16 encoding. A high-surrogate is also known as a
 * <i>leading-surrogate</i>.
 *
 * @since 1.5
 */
Lang_Character.MAX_HIGH_SURROGATE = '\uDBFF';

/**
 * The minimum value of a Unicode low-surrogate code unit in the
 * UTF-16 encoding. A low-surrogate is also known as a
 * <i>trailing-surrogate</i>.
 *
 * @since 1.5
 */
Lang_Character.MIN_LOW_SURROGATE  = '\uDC00';

/**
 * The maximum value of a Unicode low-surrogate code unit in the
 * UTF-16 encoding. A low-surrogate is also known as a
 * <i>trailing-surrogate</i>.
 *
 * @since 1.5
 */
Lang_Character.MAX_LOW_SURROGATE  = '\uDFFF';

/**
 * The minimum value of a Unicode surrogate code unit in the UTF-16 encoding.
 *
 * @since 1.5
 */
Lang_Character.MIN_SURROGATE = Lang_Character.MIN_HIGH_SURROGATE;

/**
 * The maximum value of a Unicode surrogate code unit in the UTF-16 encoding.
 *
 * @since 1.5
 */
Lang_Character.MAX_SURROGATE = Lang_Character.MAX_LOW_SURROGATE;

/**
 * The minimum value of a supplementary code point.
 *
 * @since 1.5
 */
Lang_Character.MIN_SUPPLEMENTARY_CODE_POINT = 0x010000;

