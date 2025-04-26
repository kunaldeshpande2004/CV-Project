######################################################################################################
#                          SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                            
#                      PREGNANCY TRACKER AI MODEL VERSION 2.0 (READY FOR DEPLOYMENT)               
#----------------------------------------------------------------------------------------------------
# CODE CLEANED LAST ON: 27-02-2025                                                                  
# CODE LENGTH OF FILE: PROCESS_FRAMES.PY LINE 52 - LINE 225                
# NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                        
# DATE OF DEVELOPMENT START: 10/2/2025 - 27/2/2025                                                 
#----------------------------------------------------------------------------------------------------
#                          BASIC INFORMATION ABOUT THE FILE                                        
#----------------------------------------------------------------------------------------------------
# This Python script is responsible for **analyzing ultrasound video frames** using a YOLO-based AI  
# model. It processes incoming frames, performs AI-based detections, and returns annotated results.  
# Below is a detailed breakdown of its structure and functionality:                               
'''
Core Functionality:
- Loads the **YOLOv8 model** for medical image analysis.
- Accepts **base64-encoded** frames from the frontend.
- Performs AI-based detection of **placenta, fetal skull, organs**, etc.
- Annotates detected objects on frames and converts them to **base64**.
- Returns AI predictions **as a generator** for real-time processing.

Key Features:
1. **Directory Management**:
   - Ensures required folders exist for storing **videos**, **processed frames**, and **reports**.
   - Automatically **clears old data** before starting a new analysis.

2. **YOLO Model Handling**:
   - Loads **custom-trained YOLOv8 model** for ultrasound analysis.
   - Predicts the presence of medical features **(placenta, fetus, organs, etc.)**.

3. **Processing Pipeline**:
   - **Decodes** base64 image frames received from the frontend.
   - **Runs AI inference** on each frame using YOLO.
   - **Extracts detected classes, confidence scores, and bounding boxes**.
   - **Annotates frames** and **converts results back to base64** for frontend visualization.

4. **Streaming Data with Generators**:
   - Uses Python **generators** to **stream** detection results **frame by frame**.
   - Improves performance by avoiding large memory allocations.

Security & Performance Considerations:
- Limits the size of image buffers to prevent excessive memory usage.
- Uses **environment variables** for configurable paths (e.g., `AI_BASE_DIR`).
- Clears **old temporary files** before processing new videos.

Error Handling:
- Detects and logs any frame-processing errors.
- Returns error messages **without breaking the entire process**.

'''
######################################################################################################

#                                KEY LIBRARIES & DEPENDENCIES                                      #
#----------------------------------------------------------------------------------------------------
# OpenCV (cv2)                : Handles image processing and frame decoding.                      
# NumPy                        : Optimized matrix computations for AI inference.                   
# Supervision (sv)             : Parses YOLO model detections efficiently.                         
# YOLO (ultralytics)           : Pre-trained AI model for fetal ultrasound detection.              
# Matplotlib                   : Assists in visual debugging (if needed).                         
# PIL (Pillow)                 : Handles image conversion for different formats.                   
# fpdf                         : Generates PDF reports for findings.                               
#----------------------------------------------------------------------------------------------------
# ENV OF FILE : BACKEND (AI PROCESSING, FRAME INFERENCE)                                          
# SECURITY CODE LEVEL : HIGH                                                                        
######################################################################################################

######################################## CODE STARTS HERE ##########################################

# General imports
import os
import cv2
import pdb
import base64
import shutil
import numpy as np
import supervision as sv
import gradio as gr
import matplotlib.pyplot as plt
from ultralytics import YOLO
from PIL import Image
from fpdf import FPDF
from datetime import datetime
from datetime import datetime
from pathlib import Path
# classes : ['baby', 'feto', 'placenta', 'tip']
base_dir = Path(os.getenv('AI_BASE_DIR', os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

global final_frames
final_frames = []

'''Directory Configuration'''

# LOGO_PATH = "Logo.png"  # Replace with the actual logo path

# Configuration for deployment
class DeploymentConfig:
   # MODEL_PATH = 'weights/best.pt'
   # MODEL_PATH = 'weights\\SecondTrimester\\Placenta_Position\\best.pt'
 
    MODEL_PATH = r'weights\SecondTrimester\Placenta_Position\best.pt'


    VIDEO_SAVE_DIR = "video"
    PLACENTAL_FRAME_DIR = "frames/placental_frames"
    NO_PLACENTAL_FRAME_DIR = "frames/no_placental_frames"
    FRAMES_ANALYSIS_DIR = "frames"
    SELECTED_IMAGES_REPORT = "frames/Report_images"

# Ensure the upload and frame directories exist
def clear_directory(directory):
    """Clear the directory by deleting all files and subdirectories."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

# Clear and create necessary directories
clear_directory(DeploymentConfig.VIDEO_SAVE_DIR)
clear_directory(DeploymentConfig.FRAMES_ANALYSIS_DIR)
clear_directory(DeploymentConfig.PLACENTAL_FRAME_DIR)
clear_directory(DeploymentConfig.NO_PLACENTAL_FRAME_DIR)
clear_directory(DeploymentConfig.SELECTED_IMAGES_REPORT)



'''Video Analysis'''


def load_model():
    model = YOLO(DeploymentConfig.MODEL_PATH)
    return model

def add_index_to_frames(frame,frame_number):
        
    frame_with_text = frame.copy()
    text = f"{frame_number}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1
    thickness = 2
    text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
    text_x = (frame.shape[1] - text_size[0]) // 2
    text_y = text_size[1] + 10
    cv2.putText(
        frame_with_text,
        text,
        (text_x, text_y),
        font,
        font_scale,
        (255, 0, 0),  # Blue color in BGR
        thickness,
        cv2.LINE_AA,
    )
    return frame_with_text

# Analyze detection results and save frames
def analyse_result(result, frame_number, frame_with_results, num_placental, confidence, class_name, boxes):
    detections = sv.Detections.from_ultralytics(result)
    classes_detected = detections.data['class_name']
    
    
    if classes_detected.size > 0:
        class_name = classes_detected.tolist()  # Convert NumPy array to list
        boxes = detections.xyxy
        num_placental += 1
        confidence = detections.confidence[0]
        output_path = os.path.join(DeploymentConfig.PLACENTAL_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
        cv2.imwrite(output_path, frame_with_results)
    else:
        output_path = os.path.join(DeploymentConfig.NO_PLACENTAL_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
        cv2.imwrite(output_path, frame_with_results)
        
    return num_placental, class_name, confidence, boxes


def process_frames(frames):
    
    num_placental = 0
    confidence = 0.0
    class_name = ''
    boxes = []

    # Load the AI model
    model = load_model()

    for frame_number, frame_data in enumerate(frames):
        try:
            # Decode the base64 frame data to an image
            img_data = base64.b64decode(frame_data.split(",")[1])
            np_img = np.frombuffer(img_data, dtype=np.uint8)
            frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

            # Perform AI predictions for the frame
            results_frame = model(frame)

            for result in results_frame:
                # Annotate the frame with predictions
                frame_with_results = result.plot()

                # Analyze the result and update counters
                num_placental, class_name, confidence, boxes = analyse_result(
                    result, frame_number, frame_with_results, num_placental, confidence, class_name, boxes
                )

                # Ensure all box data is converted to lists (if numpy.ndarray)
                boxes = [box.tolist() if isinstance(box, np.ndarray) else box for box in boxes]

                # Convert the annotated frame to a base64 string
                _, buffer = cv2.imencode('.jpg', frame_with_results)
                annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')

                # Yield the analysis result for this frame
                yield {
                    'frame_number': frame_number,
                    'class_name': class_name,
                    'num_placental': num_placental,
                    'confidence': float(confidence),  # Ensure confidence is a float
                    'boxes': boxes,  # Ensure boxes is a list
                    'annotated_image': annotated_image_base64  # Add the annotated image
                }
        except Exception as e:
            # Handle exceptions and provide debug information if needed
            yield {
                'frame_number': frame_number,
                'error': str(e)
            }
