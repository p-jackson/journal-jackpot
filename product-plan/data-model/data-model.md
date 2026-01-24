# Data Model

## Entities

### Prompt
A generated journal prompt combining words from each reel, along with when it was received.

### Word
An individual word that belongs to a specific reel position (1, 2, or 3).

### Reel
One of the three spinning columns (Reel 1, Reel 2, Reel 3), each containing its own pool of words.

## Relationships

- Reel has many Words
- Prompt is composed of one Word from each Reel (3 words total)
