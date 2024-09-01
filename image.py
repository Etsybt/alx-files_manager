from PIL import Image

# Create a new image with RGB mode and size 100x100 pixels
img = Image.new('RGB', (100, 100), color = 'blue')

# Save the image as image.png
img.save('image.png')
