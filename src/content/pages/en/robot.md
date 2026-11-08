---
title: AhaRobot
description: A dual-arm mobile manipulator for domestic service tasks, based on the open-source Astra robot.
---

<!-- Keep this page consistent with the TDP annex (S-T3). Update when the hardware changes. -->

## Hardware

| Part | Specification |
| --- | --- |
| Base | Differential-drive two-wheel base |
| Torso | Lift |
| Arms | Two arms with grippers |
| Head | Pan / tilt head with an Intel RealSense D435i RGB-D camera |
| Actuators | Feetech STS3215 serial bus servos, driven by an ESP32-based servo driver |
| Computing | NVIDIA DGX Spark (vision-language models, segmentation, speech recognition) and a laptop with an NVIDIA RTX 5090 |

The mechanical design is derived from the open-source [Astra](https://github.com/trail-club/Astra_Hardwares) robot.

## Software

The software runs on Ubuntu 24.04 with ROS 2 Jazzy, and is developed and tested in Gazebo Harmonic.
See [Software](/software/) for the packages and how to use them.

## Abilities

- Navigation: mapping, localization and path planning (slam_toolbox, AMCL, Nav2)
- Manipulation: motion planning for the arms (MoveIt 2)
- Perception: object segmentation and recognition, person detection, placement surface detection
- Human-robot interaction: speech recognition and speech synthesis
- Task execution: tasks split into subgoals with checkpoints and rollback, monitored from a web GUI
