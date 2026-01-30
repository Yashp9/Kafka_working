# Parent class (also known as base class or superclass)
class Animal:
    def speak(self):
        return "Animal makes a sound"

# Child class (also known as derived class or subclass)
class Dog(Animal):
    def bark(self):
        return "Dog barks"

class Cat(Animal):
    def bark(self):
        return "Cat meowwwww"

# Create an object of the child class
d = Dog()

# Access inherited method
print(d.speak())

# Access child's own method
print(d.bark())
