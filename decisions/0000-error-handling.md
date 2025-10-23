# Error handling decision

## Context and Problem statement

Exceptions and Errors are common - and I want a proper handling through the project.

## Considered Options

 * Just use Javascripts built-in error handling
 * Use custom exceptions in the Javascript error handling
 * Use return types

## Decision outcome

I decided to go with a middleground.
I would like to have the clearness, that the return types bring.
But I cannot go only this way, as exceptions are a reality in every way.
The way I go is two prone:
    1. Identifiable exception cases will be handled as Return Types
    2. There must be overreaching exception handling for unidentified exceptions.
