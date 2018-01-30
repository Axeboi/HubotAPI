/******************
 * 
 *   OUTPUT FUNCTIONS - sorted and unsorted
 *   
 *   The functions takes a query string and entries from the databaseObject,
 *   then tries to find a match in every entry "entry.comment".
 * 
 *   sorted returns object with matching entries and,
 *   number of matched words
 * 
 *   unsorted returns object with matching entries
 * 
 *****************/

function sorted(query, databaseObject, property) {
    
    let output = unsorted(query, databaseObject, property)
    return _sortResponse(output)
}

function unsorted(query, databaseObject, property) {
    let output = []
    for (entry of databaseObject) {
        let match = _getResult(query, entry[property])
        if (match) {
            output.push( {entry: entry, numMatch: match.matchedWords })
        }
    }
    return output
}

/*************
 * 
 *   UTILITY FUNCTIONS
 *
 *************/

function _getResult(input, sentence) {
    
    const regex = /[^A-Za-z0-9\s]/g
    const result = {}
    let count = 0
    
    query = input
        .replace(regex, '')
        .toLowerCase()
        .split(' ')
    
    sentence = sentence
        .replace(regex, '')
        .toLowerCase()
        .split(' ')
    
    query.map( (word) => {
        if (sentence.indexOf(word) !== -1) {
            count = count + 1
        }
    })

    result.query = input
    result.matchedWords = count

    return result.matchedWords > 0 ? result : undefined
}

function _sortResponse(results) {
    
    function compare(a, b) {
        const valA = a.numMatch
        const valB = b.numMatch

        let comparator = 0
        if (valA > valB) comparator = -1
        if (valA < valB) comparator = 1
        return comparator
    }

    results = results.sort(compare)
    return results
}


/********
 * 
 * EXPORT
 * 
 *******/

const Query = {}
Query.sorted = sorted
Query.unsorted = unsorted


module.exports = Query
