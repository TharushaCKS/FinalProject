import serial
import tkinter as tk

class LightBulbApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Light Bulb Simulation")
        
        # Open the serial port
        self.ser = serial.Serial('COM5', 9600) #serial Connection
        
        # Define the number of rows and columns in the matrix
        self.rows = 8
        self.columns = 8
        
        # Create a matrix of buttons
        bulb_number = 1
        for i in range(self.rows):
            for j in range(self.columns):
                btn_text = f"Bulb {bulb_number} OFF"
                btn = tk.Button(root, text=btn_text, width=15, height=3, 
                                command=lambda bulb_number=bulb_number: self.toggle_bulb(bulb_number))
                btn.grid(row=i, column=j)
                bulb_number += 1
    
    def toggle_bulb(self, bulb_number):
     # Get the button at the specified row and column
     button = self.root.grid_slaves(row=(bulb_number - 1) // self.columns, column=(bulb_number - 1) % self.columns)[0]
     
     # Toggle the state of the bulb
     if "OFF" in button.cget("text"):
         button.config(text=f"Bulb {bulb_number} ON", bg="green")  # Set background to green when ON
         state = 1
     else:
         button.config(text=f"Bulb {bulb_number} OFF", bg="red")  # Set background to red when OFF
         state = 0
     
     # Send data to Arduino
     data_str = f"{bulb_number},{state}\n"
     self.ser.write(data_str.encode())


#main window
root = tk.Tk()

# Create an instance
app = LightBulbApp(root)

# Run event loop
root.mainloop()

# Close the serial port when the application is closed
app.ser.close()
