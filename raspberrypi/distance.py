#!/usr/bin/env python
import RPi.GPIO as GPIO
from firebase import firebase
import time
import datetime
import signal
import logging
#import os
#os.environ["HTTPS_PROXY"] = "http://192.168.2.114:3128"

logging.basicConfig(format='%(asctime)-15s: %(message)s', filename='/var/log/distance/distance.log', level=logging.DEBUG)
firebase = firebase.FirebaseApplication('https://thanni.firebaseio.com', None)

GPIO.setmode(GPIO.BCM)

TRIG = 23
ECHO = 24
DISTANCE_CHANGE_TO_NOTIFY = 5 # in cms
TIME_INTERVAL_TO_NOTIFY = 30 * 60 # in secs

logging.info("Distance Measurement In Progress")

GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)

def reset_gpio(signal, frame):
  GPIO.cleanup()

signal.signal(signal.SIGINT, reset_gpio)

firebase_log = {'tank1': {}}
def send_to_firebase(tank, distance):
  global firebase_log
  timestamp = int(time.time())
  last_sent_timestamp = firebase_log[tank].get('timestamp', 0)
  last_sent_distance = firebase_log[tank].get('distance', 0)

  logging.debug([timestamp, distance, firebase_log])

  if ((timestamp - last_sent_timestamp) >= TIME_INTERVAL_TO_NOTIFY) or (abs(distance - last_sent_distance) >= DISTANCE_CHANGE_TO_NOTIFY):
    datetime_str = datetime.datetime.now().isoformat()
    firebase_log[tank]['timestamp'] = timestamp

    data = {'time': datetime_str, 'timestamp': timestamp, 'distance': distance}
    firebase.put('/readings/' + tank + '/', timestamp, data) 
  
  firebase_log[tank]['distance'] = distance
  

GPIO.output(TRIG, False)
time.sleep(5)

while 1:
  GPIO.output(TRIG, True)
  time.sleep(0.00001)
  GPIO.output(TRIG, False)

  while GPIO.input(ECHO)==0:
    pulse_start = time.time()

  while GPIO.input(ECHO)==1:
    pulse_end = time.time()

  pulse_duration = pulse_end - pulse_start
  distance = pulse_duration * 17150
  distance = round(distance, 2)

  logging.info("Distance: %s cm",distance)
  print distance
  send_to_firebase('tank1', distance)
  time.sleep(2)
