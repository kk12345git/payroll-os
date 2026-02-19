from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import date, time, datetime

class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: str = "Present"  # Present, Absent, Half Day, Holiday, Leave
    work_location: str = "Office"  # Office, Remote, Field
    remarks: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: Optional[str] = None
    work_location: Optional[str] = None
    remarks: Optional[str] = None

class Attendance(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AttendanceBulkItem(BaseModel):
    employee_code: str
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: str = "Present"
