/*
* Recursively merge properties of two objects
*/
export default function MutableMergeRecursive(source, update) {

    for (let p in update) {
        try {
            // Property in destination object set; update its value.
            if (update[p].constructor === Object) {
                source[p] = MutableMergeRecursive(source[p], update[p]);

            } else {
                source[p] = update[p];
            }

        } catch (e) {
            // Property in destination object not set; create it and set its value.
            source[p] = update[p];
        }
    }

    return source;
}