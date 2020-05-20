/* FILE NAME: shifting_algorithm.js
 * PROGRAMMER: VG6
 * DATE: 20.05.2020
 * Purpose: To implement shifting algorithm
 */

/* Shifting array to the left
 * Arguments:
 *    - array to shift
 *        arr
 * Returns:
 *    - shifted array
 *        new_arr
* */
function shiftLeft(arr) {

    /* shifted array */
    let new_arr = [];

    /* return empty array if given is empty */
    if (arr.length === 0)
        return new_arr;

    /* indicator if we at start of sequence */
    let at_start = true;

    /* indicator of possible merge */
    let delta = 1;

    /* last element of array */
    let last = arr[arr.length - 1];

    /* shifting array starting from 2nd elem from right */
    for (let i = arr.length - 2; i >= 0; i--) {
        /* if we are at start of sequence and previous element
           in array is the same, changing at start flag to false
           because we are starting to find sequence
           example: 1 1. for i = 0, arr[1] = last = 1 */
        if (at_start && arr[i] === last) {
            at_start = false;
        }
        /* we need to go on if we are not at start of the sequence
           and encountered element greater our by 1, because further
           we will be able to merge them all
           example: 2 1 1. if we are at 2nd element (1) we have at_start = false
           and arr[0] - delta = last = 1. So we can first merge 1 1 to 2 and then
           merge 2 to 2 and get 4 as result */
        else if (!at_start && arr[i] - delta === last);
        else {
            /* this section indicating that we are at the end
               of the sequence or haven't started it and no candidates
               for it, so if at_start = true => we haven't started sequence
               and no candidates, so we just need to push last elem to new array
               but if we have sequence, pushing last + delta to new array
               examples: 4 2 1 1. if we are at third elem from right (2)
               we have no candidates to continue sequence, but we have sequence,
               so we merge 1 1 to 2, 2 2 to 3. Last elem = 2, but new should be 3,
               so pushing last + 1. If we have 3 4 5, and we are at first element
               from right (5), we haven't started sequence and no candidates, so
               just push 5 to new array */
            if (at_start) {
                new_arr.push(last);
            }
            else {
                new_arr.push(last + delta);
            }
            at_start  = true;
        }
        /* moving last element to ith element */
        last = arr[i];
    }

    /* finally we need to check if sequence finished, but we didn't add
       needed element to array. if we are at start, just push last element
       and if we have sequence, push last + delta
       examples: 2 1 1. After cycle, we will stay at first element from left (2),
       but we haven't added it to new array yet, so we need to add last element + delta
       if our case 2 + 1 = 3 */
    if (at_start)
        new_arr.push(last);
    else
        new_arr.push(last + delta);

    /* finally we need to return reversed array */
    return new_arr.reverse();
}

/* Shifting array to the right
 * Arguments:
 *    - array to shift
 *        arr
 * Returns:
 *    - shifted array
 *        new_arr
* */
function shiftRight(arr) {
    /* shifted array */
    let new_arr = [];

    /* return empty array if given is empty */
    if (arr.length === 0)
        return new_arr;

    /* indicator if we at start of sequence */
    let at_start = true;

    /* indicator of possible merge */
    let delta = 1;

    /* last element of array */
    let last = arr[0];

    /* shifting array starting from 1nd elem from left */
    for (let i = 1; i < arr.length; i++) {
        /* if we are at start of sequence and next element
           in array is the same, changing at start flag to false
           because we are starting to find sequence
           example: 1 1. for i = 1, arr[1] = last = 1 */
        if (at_start && arr[i] === last) {
            at_start = false;
        }
        /* we need to go on if we are not at start of the sequence
           and encountered element greater our by 1, because further
           we will be able to merge them all
           example: 1 1 2. if we are at 2nd element (1) we have at_start = false
           and arr[2] - delta = last = 1. So we can first merge 1 1 to 2 and then
           merge 2 to 2 and get 4 as result */
        else if (!at_start && arr[i] - delta === last);
        else {
            /* this section indicating that we are at the end
               of the sequence or haven't started it and no candidates
               for it, so if at_start = true => we haven't started sequence
               and no candidates, so we just need to push last elem to new array
               but if we have sequence, pushing last + delta to new array
               examples: 1 1 2 4. if we are at third elem from left (2)
               we have no candidates to continue sequence, but we have sequence,
               so we merge 1 1 to 2, 2 2 to 3. Last elem = 2, but new should be 3,
               so pushing last + 1. If we have 5 4 3, and we are at first element
               from left (5), we haven't started sequence and no candidates, so
               just push 5 to new array */
            if (at_start) {
                new_arr.push(last);
            }
            else {
                new_arr.push(last + delta);
            }

            at_start  = true;
        }

        /* moving last element to ith element */
        last = arr[i];
    }
    /* finally we need to check if sequence finished, but we didn't add
       needed element to array. if we are at start, just push last element
       and if we have sequence, push last + delta
       examples: 1 1 2. After cycle, we will stay at first element from right (2),
       but we haven't added it to new array yet, so we need to add last element + delta
       if our case 2 + 1 = 3 */
    if (at_start)
        new_arr.push(last);
    else
        new_arr.push(last + delta);

    /* finally return array */
    return new_arr;
}

/* Finding possible collapse len to the right
 * Arguments:
 *    - array to shift
 *        arr
 * Returns:
 *    - shifted array
 *        new_arr
* */
function right_collapse_len(arr) {
    /* if given array is empty, returning 0 */
    if (arr.length === 0)
        return 0;

    /* overall sequence len */
    let seq_len = 0;

    /* current sequence len*/
    let cur_len = 1;

    /* last elemnt of array */
    let last = arr[0];

    /* finding sequences */
    for (let i = 1 ; i < arr.length; i++) {
        /* if ith element  = i - 1, we got sequence of 2 at least
           example: 1 1. if we are at second elem from left (1),
           arr[1] = last = 1, so len of seq = 2 */
        if (cur_len === 1 && arr[i] === last)
            cur_len++;
        /* if we have some sequence and current elem = last + 1
           that means we can merge them and continue sequence
           example: 1 1 2. if we are at first elem from right (2),
           we can first merge 1 1 = 2 and then merge 2 2 to get 4,
           so we do*/
        else if (cur_len > 1 && arr[i] === last + 1)
            cur_len++;
        /* if we have sequence but no candidate to merge,
           we need to add current sequence len to overall sequence
           length and reset current length */
        else if (cur_len > 1) {
            seq_len += cur_len - 1;
            cur_len = 1;
        }

        /* moving element to ith */
        last = arr[i];
    }

    /* here we ensure that we added all sequences to final result.
       it doesn't change anything if curr_len = 1*/
    return seq_len + cur_len - 1;
}

/* Finding possible collapse len to the left
 * Arguments:
 *    - array to shift
 *        arr
 * Returns:
 *    - shifted array
 *        new_arr
* */
function left_collapse_len(arr) {
    /* if given array is empty, returning 0 */
    if (arr.length === 0)
        return 0;

    /* overall sequence len */
    let seq_len = 0;

    /* current sequence len*/
    let cur_len = 1;

    /* last elemnt of array */
    let last = arr[arr.length - 1];

    /* finding sequences */
    for (let i = arr.length - 2 ; i >= 0; i--) {
        /* if ith element  = i + 1, we got sequence of 2 at least
           example: 1 1. if we are at second elem from right (1),
           arr[1] = last = 1, so len of seq = 2 */
        if (cur_len === 1 && arr[i] === last)
            cur_len++;
        /* if we have some sequence and current elem = last + 1
           that means we can merge them and continue sequence
           example: 2 1 1. if we are at first elem from left (2),
           we can first merge 1 1 = 2 and then merge 2 2 to get 4,
           so we do*/
        else if (cur_len > 1 && arr[i] === last + 1)
            cur_len++;
        /* if we have sequence but no candidate to merge,
           we need to add current sequence len to overall sequence
           length and reset current length */
        else if (cur_len > 1) {
            seq_len += cur_len - 1;
            cur_len = 1;
        }
        /* moving to ith element */
        last = arr[i];
    }

    /* here we ensure that we added all sequences to final result.
        it doesn't change anything if curr_len = 1*/
    return seq_len + cur_len - 1;
}

/* Getting sequence of shifts and resulted array
 * Arguments:
 *    - array to get sequence from
 *        array
 * Returns:
 *    - resulted array and shifts
 *        [array, seq]
 */
function get_sequence(array) {
    /* converting array to power of 2 */
    array = array.map((element) => Math.log2(element));

    /* final sequence array */
    let seq = [];

    /* if got array with len <= 1 we have
       nothing to do with it, so just return
       empty sequence */
    if (array.length <= 1)
        return seq;

    /* last length of array */
    let last_arr_length = array.length;

    /* shifting array */
    while (true) {
        /* getting action whether to shift to right or left */
        let shift_to_Right = right_collapse_len(array) >= left_collapse_len(array);

        /* pushing action to sequence array */
        seq.push(shift_to_Right);

        /* shifting array */
        array = shift_to_Right ? shiftRight(array) : shiftLeft(array);

        /* if length of array hasn't changed, that means
           we've made useless action and we need to remove it */
        if (array.length - last_arr_length === 0) {
            seq.pop();
            break;
        }

        /* assigning new array's lenght */
        last_arr_length = array.length;
    }

    /* returning resulted array and best sequence */
    return [array, seq];
}

/* Converting sequence to actions
 * Arguments:
 *    - sequence to convert
 *        seq
 * Returns:
 *    - actions array
 *        actions
 */
function seq_to_action(seq)
{
    /* actions array */
    actions = []

    /* going through array and replacing
       true with right and false with left */
    for (let i = 0; i < seq.length; i++)
    {
        actions.push(seq[i] ? 'right' : 'left');
    }

    /* returning action */
    return actions;
}

/* creating arrays to test */
let initial_arr_1 = [4, 2, 2];
let initial_arr_2 = [1, 4, 16, 8, 8, 2, 1];

/* resulting array and sequence pair of original array */
let resulted_array_seq_1 = get_sequence(initial_arr_1);
let resulted_array_seq_2 = get_sequence(initial_arr_2);

/* logging results */
console.log("Initial array: " + initial_arr_1);
console.log("Best actions: " + seq_to_action(resulted_array_seq_1[1]));
console.log("Resulted array: " + resulted_array_seq_1[0].map((element) => Math.pow(2, element)));
console.log("Initial array: " + initial_arr_2);
console.log("Best actions: " + seq_to_action(resulted_array_seq_2[1]));
console.log("Resulted array: " + resulted_array_seq_2[0].map((element) => Math.pow(2, element)));

