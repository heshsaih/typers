package model

import "gorm.io/gorm"

type Session struct {
	gorm.Model
	UserID uint `gorm:"not null;index"`
	User   User `gorm:"foreignKey:UserID;constraint:OnDelete:SET = NULL"`
	Active bool `gorm:"not null;uniqueIndex:idx_one_active_session_per_user,where:active = true"`
}
