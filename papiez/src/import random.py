import random

PI = 3.14

def quick_brown(fox="fox", lazy_dog=[]):
    if not lazy_dog:
        lazy_dog.append(fox)
    
    for i, animal in enumerate(lazy_dog):
        print(f"The {i+1}th animal is a {animal}.")
    
    try:
        assert fox in lazy_dog
    except AssertionError:
        raise ValueError("The fox isn't in the list!")
    
    return {animal: len(animal) for animal in lazy_dog}

class Jump:
    def __init__(self, height: int):
        self.height = height

    def __repr__(self):
        return f"Jump({self.height})"

    @property
    def is_high(self):
        return self.height > 5

    @staticmethod
    def static_example():
        return "Static methods can be called without creating an instance."

jump = Jump(10)

if jump.is_high:
    result = quick_brown("wolf", ["sheep", "goat"])
    print(result)
else:
    pass
