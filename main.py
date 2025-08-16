from pokemontcgsdk import Card, Set, RestClient
from PIL import Image, ImageTk
import requests
from io import BytesIO
import tkinter as tk

RestClient.configure('0dd20c22-80be-4f00-96da-2cd99be624d0')

images = []

def get_Image(numcards):
    for i in range(1, 2):
        card = Card.find(f'sv10-{i}')
        card_image = requests.get(card.images.small)
        img = Image.open(BytesIO(card_image.content))
        images.append(img)  

set = Set.find('sv10')
get_Image(set.printedTotal)

# Create a Tkinter window to display the images
root = tk.Tk()
root.title("Pokemon Card Grid")

# Convert PIL images to Tkinter PhotoImage
tk_images = [ImageTk.PhotoImage(img) for img in images]

cols = 5  # Number of columns in the grid
for idx, tk_img in enumerate(tk_images):
    row = idx // cols
    col = idx % cols
    label = tk.Label(root, image=tk_img)
    label.grid(row=row, column=col, padx=5, pady=5)

root.mainloop()


