import { Review } from '../../app/interfaces/review';

let lastId = 0;

export function getNextReviewId(): number {
    return ++lastId;
}

export const reviews: Review[] = [
    {
        id: getNextReviewId(),
        date: '2018-05-27',
        author: 'Samantha Smith',
        avatar: 'assets/images/avatars/avatar-1.jpg',
        rating: 4,
        content: `Phasellus id mattis nulla. Mauris velit nisi, imperdiet vitae sodales in, maximus ut lectus. Vivamus
                  commodo scelerisque lacus, at porttitor dui iaculis id. Curabitur imperdiet ultrices fermentum.`,
    },
    {
        id: getNextReviewId(),
        date: '2018-04-12',
        author: 'Adam Taylor',
        avatar: 'assets/images/avatars/avatar-2.jpg',
        rating: 3,
        content: `Aenean non lorem nisl. Duis tempor sollicitudin orci, eget tincidunt ex semper sit amet. Nullam neque
                  justo, sodales congue feugiat ac, facilisis a augue. Donec tempor sapien et fringilla facilisis. Nam
                  maximus consectetur diam. Nulla ut ex mollis, volutpat tellus vitae, accumsan ligula.`,
    },
    {
        id: getNextReviewId(),
        date: '2018-01-02',
        author: 'Helena Garcia',
        avatar: 'assets/images/avatars/avatar-3.jpg',
        rating: 5,
        content: `Duis ac lectus scelerisque quam blandit egestas. Pellentesque hendrerit eros laoreet suscipit
                  ultrices.`,
    },
];
