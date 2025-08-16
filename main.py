from pokemontcgsdk import Card, Set, RestClient
from PIL import Image, ImageTk
import requests
from io import BytesIO
import tkinter as tk
import os

api_key = os.getenv('POKEMON_TCG_API_KEY')
RestClient.configure(api_key)

images = []


def get_Image(numcards: int) -> Image:
    for i in range(1, 2):
        card = Card.find(f'sv10-{i}')
        card_image = requests.get(card.images.small)
        img = Image.open(BytesIO(card_image.content))
        return img


set = Set.find('sv10')
images.append(get_Image(set.printedTotal))

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
