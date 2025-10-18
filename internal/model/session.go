package model

import "gorm.io/gorm"

type Session struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Active bool `gorm:"notnull;uniqueIndex:idx_one_active_session_per_user,where:active = true"`
}
