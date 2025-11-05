"""
Robot Modes
Defines the three operational modes for Kali robot
"""

from enum import Enum

class RobotMode(Enum):
    """Robot operational modes"""
    KID = "kid"       # Educational mode for children
    CYBER = "cyber"   # Penetration testing mode
    LOCKED = "locked" # Locked/secured mode
